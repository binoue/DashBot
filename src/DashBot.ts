import { Client, Message } from 'discord.js';
import { Action } from './Action';
import { ActionResult } from './ActionResult';
import { ABResponseAction } from './Actions/ABResponseAction';
import { DadJokeAction } from './Actions/DadJokeAction';
import { DieAction } from './Actions/DieAction';
import { GreetAction } from './Actions/GreetAction';
import { HaikuAction } from './Actions/HaikuAction';
import { HelpAction } from './Actions/HelpAction';
import { ImgurSearchAction } from './Actions/ImgurSearchAction';
import { NumberGameAction } from './Actions/NumberGameAction';
import { OneOffReplyAction } from './Actions/OneOffReplyAction';
import { StatsAction } from './Actions/StatsAction';
import { TraceryAction } from './Actions/TraceryAction';
import { DashBotConfig } from './DashBotConfig';
import { logger } from './main';
import { StatTracker } from './StatTracker';

export default class DashBot {
	public readonly stats: StatTracker;
	public readonly client: Client;
	public readonly config: DashBotConfig;

	constructor({
		client,
		config,
		stats,
	}: {
		client: Client;
		config: DashBotConfig;
		stats: StatTracker;
	}) {
		this.client = client;
		this.config = config;
		this.stats = stats;

		this.bindEvents();
		this.initActions();
	}

	public login(): Promise<string> {
		return this.client.login(this.config.discordBotToken);
	}

	public destroy(): Promise<void> {
		return this.client.destroy();
	}

	private bindEvents(): void {
		this.client.on('ready', () => {
			logger.info(`Logged in as ${this.client.user.tag}!`);
		});

		this.client.on('message', this.onMessage.bind(this));
	}

	private onMessage(message: Message): void {
		if (message.author.bot) return;
		const handled = this.actions.some(action =>
			ActionResult.isHandled(action.handle(message))
		);
		logger.info(`Message ${handled ? 'handled' : 'ignored'}`);
	}

	private initActions(): void {
		this.actions.push(
			new OneOffReplyAction(
				this,
				msg => /^compliment( please)?/i.test(msg.content),
				[
					'@n, you have beautiful eyes.',
					'@n, your face reminds me of someone who has a beautiful face.',
					"Music is better when I listen to it with @n! Oh wait, this isn't plug.dj! :open_mouth:",
					"I don't care about trying to be more human-like, but if I could be more like @n I would be happy.",
					"If I had eyes, they'd be looking at you @n!",
					'You have an exquisite aura',
					"My friends won't believe me when I go home tonight and tell them I met @n today!",
				]
			),
			new OneOffReplyAction(
				this,
				msg => /^insult( please)?/i.test(msg.content),
				[
					"I couldn't possibly insult someone as kind as you @n.",
					"There's nothing bad to say about you.",
					'Why do you want me to do that?',
					'A positive attitude starts with positive behaviour, insults are counter productive',
					"Oh, um, I don't like your.. stunning good looks?",
				]
			),
			new OneOffReplyAction(
				this,
				msg => /^(여보세요|안녕하세요)/i.test(msg.content),
				['나는 한국어를 못하지만 내 친구 인 @n는합니다.']
			),
			new OneOffReplyAction(
				this,
				msg =>
					/^(こんいちは|今日は|おはよう|こんばんは)/i.test(
						msg.content
					),
				[
					'おはよう。。。かそれがこんばんわですか?何時かわからない :man_shrugging:',
				]
			),
			new OneOffReplyAction(
				this,
				msg => /^(만나서 반가워요)/i.test(msg.content),
				['만나서 반가워요 @n']
			),
			new OneOffReplyAction(
				this,
				msg => /^link(age)? (pls|please)$/i.test(msg.content),
				[
					'http://i.imgur.com/03t8FfH.gif',
					'http://i.imgur.com/oeCQSZa.gif',
					'http://24.media.tumblr.com/tumblr_mdcyicRSCh1r84nrbo2_400.gif',
					'http://fc09.deviantart.net/fs70/f/2012/019/6/6/dance_link__daaance__by_nasakii-d4mzerp.gif',
					'http://fc06.deviantart.net/fs71/f/2012/063/4/e/links_dubstep_dance_by_13alicia-d4rq2jm.gif',
					'http://fc06.deviantart.net/fs44/f/2009/117/9/0/Dance_chibi_Link_dance_xD_by_sparxpunx.gif',
					'http://img2.wikia.nocookie.net/__cb20140626040013/walkingdead/images/8/85/Link_dance.gif',
					'http://i859.photobucket.com/albums/ab159/gothictsukasa/Legend-of-zelda-link-navi.gif',
					'http://images6.fanpop.com/image/photos/32500000/Link-the-legend-of-zelda-32575476-500-500.gif',
				]
			),
			new OneOffReplyAction(
				this,
				msg => /^sassy (ro)?bot$/i.test(msg.content),
				[
					'https://thenypost.files.wordpress.com/2017/08/170804-sassy-communists-chatbots-feature.jpg?quality=90&strip=all&w=618&h=410&crop=1',
					'https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Alan_Tudyk_as_K-2SO-Rogue_One_%282016%29.jpg/220px-Alan_Tudyk_as_K-2SO-Rogue_One_%282016%29.jpg',
				]
			),

			new OneOffReplyAction(
				this,
				msg =>
					/^pon(y|ies) (pictures? )?(pls|please)$/i.test(msg.content),
				[
					'http://media.giphy.com/media/mRqTOQkwmO9xe/giphy.gif',
					'http://i284.photobucket.com/albums/ll40/JazzEx022/111009-animatedapple_bloomdeadpoolscootaloosilver_spoonSpider-ManspidermanSweetie_BelleTwist.gif',
					'http://media.giphy.com/media/oDq2jEKDLJ8E8/giphy.gif',
					'http://media1.giphy.com/media/I1hC7mQZpW4jS/giphy.gif',
					'http://31.media.tumblr.com/8dd4c7fe07aead115ea3e6171708d1ca/tumblr_modktorBMz1rthxy9o1_500.gif',
					'http://img4.wikia.nocookie.net/__cb20140309190904/mlp/images/d/dc/AppleHappyJumping.gif',
					//dancing
					'http://4.bp.blogspot.com/-7Rj2RNCajsE/UK6T9HBBU9I/AAAAAAABDmw/cDHRKhiOClI/s1600/32271__safe_animated_dinky-hooves_dance.gif',
					'http://www.gurl.com/wp-content/uploads/2013/09/my-little-pony-dancing-car.gif',
					'http://img3.wikia.nocookie.net/__cb20110314152016/mlpfanart/images/c/c2/Pinkie_Pie_dancing_to_her_Zecora_song.gif',
					'http://img1.wikia.nocookie.net/__cb20110503154149/mlp/images/4/43/Gummy_dancing_S1E25.gif',
					'http://img2.wikia.nocookie.net/__cb20140415224206/mipequeoponyfanlabor/es/images/9/9a/Pony_dance_gif_by_gibsonflyingv-d4ia62q.gif',
					'http://fc07.deviantart.net/fs71/f/2013/113/5/8/my_little_pony___pesonajes_gifs_by_happysadlife-d62q7pj.gif',
					'http://img4.wikia.nocookie.net/__cb20130102165457/mlpfanart/images/e/e7/Luna_clapping.gif',
				]
			),

			new OneOffReplyAction(
				this,
				msg => /^who is best pony\??$/i.test(msg.content),
				[
					'Rainbow Dash, obviously, though it is close.',
					'Pinkie Pie dictates that I answer Pinkie Pie',
					'Who do you think? Its obviously Discord lol',
					'#TeamTrees',
				]
			),
			new ABResponseAction(this, [
				['meaning of life', '42'],
				['give cookie', ':cookie:'],
				['give 2 cookies', "no, don't be greedy"],
				['speed of an african swallow', 'I have no idea, sorry.'],
				['rock paper scissors', "um.. I don't have hands"],
				['pi', '22/7'],
			]),
			new GreetAction(this),
			new DieAction(this),
			new StatsAction(this),
			new DadJokeAction(this),
			new HaikuAction(this),
			new TraceryAction(this),
			new NumberGameAction(this),
			new HelpAction(this)
		);

		if (this.config.imgurClientId) {
			this.actions.push(new ImgurSearchAction(this));
		}
	}

	actions: Action[] = [];
}
