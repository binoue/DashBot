import { Grammar } from './Grammar';
import { NodeAction } from './NodeAction';
import { Parser } from './Parser';
import { RawRule } from './RuleSet';
import { Section, SectionType } from './Section';
import { Tracery } from './Tracery';

export class TraceryNode {
	private expansionErrors: ErrorLog = [];
	private depth: number;
	private raw: RawRule;
	private preActions: Array<NodeAction> | undefined;
	private postActions: Array<NodeAction> | undefined;
	private modifiers: Array<string> | undefined;
	private isExpanded: boolean;

	public childRule: RawRule | undefined;
	public action: NodeAction | undefined;
	public errors: ErrorLog = [];
	public symbol: string | undefined;
	public finishedText = '';
	public grammar: Grammar;
	public parent: TraceryNode | null;
	public children: Array<TraceryNode> = [];
	public type: SectionType;

	constructor(
		private tracery: Tracery,
		parent: TraceryNode | Grammar,
		public childIndex: number,
		settings: Section
	) {
		// No input? Add an error, but continue anyways
		if (settings.raw === undefined) {
			this.errors.push('Empty input for node');
			settings.raw = '';
		}

		// If the root node of an expansion, it will have the grammar passed as the 'parent'
		//  set the grammar from the 'parent', and set all other values for a root node
		if (parent instanceof Grammar) {
			this.grammar = parent;
			this.parent = null;
			this.depth = 0;
			this.childIndex = 0;
		} else {
			this.grammar = parent.grammar;
			this.parent = parent;
			this.depth = parent.depth + 1;
			this.childIndex = childIndex;
		}

		this.raw = settings.raw;
		this.type = settings.type;
		this.isExpanded = false;

		if (this.grammar === null) {
			throw new Error('No grammar specified for this node');
		}
	}

	toString(): string {
		return (
			"Node('" + this.raw + "' " + this.type + ' d:' + this.depth + ')'
		);
	}

	// Expand the node (with the given child rule)
	//  Make children if the node has any
	expandChildren(childRule: RawRule, preventRecursion: boolean): void {
		this.children = [];
		this.finishedText = '';

		// Set the rule for making children,
		// and expand it into section
		this.childRule = childRule;
		const parseResult = Parser.parse(childRule);

		// Add errors to this
		if (parseResult.errors.length > 0) {
			this.errors = this.errors.concat(parseResult.errors);
		}

		const sections = parseResult.sections;

		for (let i = 0; i < sections.length; i++) {
			this.children[i] = new TraceryNode(
				this.tracery,
				this,
				i,
				sections[i]
			);
			if (!preventRecursion) this.children[i].expand(preventRecursion);

			// Add in the finished text
			this.finishedText += this.children[i].finishedText;
		}
	}

	// Expand this rule (possibly creating children)
	expand(preventRecursion = false): void {
		if (!this.isExpanded) {
			this.isExpanded = true;

			this.expansionErrors = [];

			// Types of nodes
			// -1: raw, needs parsing
			//  0: Plaintext
			//  1: Tag ("#symbol.mod.mod2.mod3#" or "#[pushTarget:pushRule]symbol.mod")
			//  2: Action ("[pushTarget:pushRule], [pushTarget:POP]", more in the future)

			switch (this.type) {
				// Raw rule
				case SectionType.Raw:
					this.expandChildren(this.raw, preventRecursion);
					break;

				// plaintext, do nothing but copy text into finished text
				case SectionType.Plaintext:
					this.finishedText = this.raw;
					break;

				// Tag
				case SectionType.Tag:
					// Parse to find any actions, and figure out what the symbol is
					this.preActions = [];
					this.postActions = [];

					const parsed = Parser.parseTag(this.raw);
					if (parsed == null) return;

					// Break into symbol actions and modifiers
					this.symbol = parsed.symbol;
					this.modifiers = parsed.modifiers;

					// Create all the preActions from the raw syntax
					for (let i = 0; i < parsed.preActions.length; i++) {
						this.preActions[i] = new NodeAction(
							this.tracery,
							this,
							parsed.preActions[i].raw
						);
					}
					for (let i = 0; i < parsed.postActions.length; i++) {
						//   this.postActions[i] = new NodeAction(this, parsed.postActions[i].raw);
					}

					// Make undo actions for all preActions (pops for each push)
					for (let i = 0; i < this.preActions.length; i++) {
						if (this.preActions[i].type === 0) {
							const undoAction = this.preActions[i].createUndo();
							if (undoAction !== null)
								this.postActions.push(undoAction);
						}
					}

					// Activate all the preActions
					for (let i = 0; i < this.preActions.length; i++) {
						this.preActions[i].activate();
					}

					this.finishedText = this.raw;

					// Expand (passing the node, this allows tracking of recursion depth)

					const selectedRule = this.grammar.selectRule(
						this.symbol,
						this,
						this.errors
					);

					if (selectedRule !== null)
						//TODO: Check its ok to skip this call
						this.expandChildren(selectedRule, preventRecursion);

					// Apply modifiers
					// TODO: Update parse function to not trigger on hashtags within parenthesis within tags,
					//   so that modifier parameters can contain tags "#story.replace(#protagonist#, #newCharacter#)#"
					for (let i = 0; i < this.modifiers.length; i++) {
						let modName = this.modifiers[i];
						let modParams: Array<string> = [];
						if (modName.indexOf('(') > 0) {
							const regExp = /\(([^)]+)\)/;

							// Todo: ignore any escaped commas.  For now, commas always split
							const results = regExp.exec(this.modifiers[i]);
							if (!results || results.length < 2) {
							} else {
								modParams = results[1].split(',');
								modName = this.modifiers[i].substring(
									0,
									modName.indexOf('(')
								);
							}
						}

						const mod = this.grammar.modifiers[modName];

						// Missing modifier?
						if (!mod) {
							this.errors.push('Missing modifier ' + modName);
							this.finishedText += '((.' + modName + '))';
						} else {
							this.finishedText = mod(
								this.finishedText,
								modParams
							);
						}
					}

					// Perform post-actions
					for (let i = 0; i < this.postActions.length; i++) {
						this.postActions[i].activate();
					}
					break;
				case SectionType.Action:
					// Just a bare action?  Expand it!
					this.action = new NodeAction(this.tracery, this, this.raw);
					this.action.activate();

					// No visible text for an action
					// TODO: some visible text for if there is a failure to perform the action?
					this.finishedText = '';
					break;
			}
		} else {
			//console.warn("Already expanded " + this);
		}
	}

	clearEscapeChars(): void {
		this.finishedText = this.finishedText
			.replace(/\\\\/g, 'DOUBLEBACKSLASH')
			.replace(/\\/g, '')
			.replace(/DOUBLEBACKSLASH/g, '\\');
	}
}
