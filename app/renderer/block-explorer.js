// TODO(lukechilds): Extract this into an npm package when it's more mature
import ow from 'ow';
import {isEtomic} from '../marketmaker/supported-currencies';

const explorers = new Map(Object.entries({
	888: 'https://chainz.cryptoid.info/octo/tx.dws?{txid}',
	ABY: 'http://explorer.artbyte.me/tx/{txid}',
	ANC: 'http://abe.darkgamex.ch:2751/tx/{txid}',
	ARC: 'http://explorer.arcticcoin.org/tx/{txid}',
	ARG: 'https://chainz.cryptoid.info/arg/tx.dws?{txid}',
	ATB: 'https://explorer.atbcoin.com/tx/{txid}',
	AXE: 'http://207.246.65.114:3001/tx/{txid}',
	AXO: 'https://axo.kmdexplorer.io/tx/{txid}',
	BAY: 'https://chainz.cryptoid.info/bay/tx.dws?{txid}',
	BCBC: 'http://be.cleanblockchain.org/tx/{txid}',
	BCH: 'https://blockchair.com/bitcoin-cash/transaction/{txid}',
	BCO: 'https://explorer.bridgecoin.org/tx/{txid}',
	BDL: 'https://explorer.bitdeal.co.in/tx/{txid}',
	BEER: 'https://beer.kmdexplorer.io/tx/{txid}',
	BGN: 'http://BGN.explorer.supernet.org/tx/{txid}',
	BITS: 'http://explorer.v2.bitstarcoin.com/tx/{txid}',
	BLK: 'https://chainz.cryptoid.info/blk//tx.dws?{txid}',
	BLOCK: 'https://chainz.cryptoid.info/block/tx.dws?{txid}',
	BOTS: 'https://bots.kmdexplorer.io/tx/{txid}',
	BTA: 'https://chainz.cryptoid.info/bta/tx.dws?{txid}',
	BTC: 'https://www.blocktrail.com/BTC/tx/{txid}',
	BTCH: 'https://btch.kmdexplorer.io/tx/{txid}',
	BTCP: 'https://explorer.btcprivate.org/tx/{txid}',
	BTCZ: 'https://explorer.bitcoinz.site/tx/{txid}',
	BTG: 'https://btgexp.com/tx/{txid}',
	BTM: 'http://explorer.bitmark.io/tx/{txid}',
	BTNX: 'http://explorer.bitnexus.online/tx/{txid}',
	BTX: 'https://chainz.cryptoid.info/btx/tx.dws?{txid}',
	BUCK: 'https://explorer.buck.red/tx/{txid}',
	CALL: 'https://call.explorer.mycapitalco.in/tx/{txid}',
	CARB: 'https://chainz.cryptoid.info/carbon/tx.dws?{txid}',
	CC: 'http://ccl.explorer.dexstats.info/tx/{txid}',
	CEAL: 'https://ceal.kmdexplorer.io/tx/{txid}',
	CHAIN: 'https://explorer.chainmakers.co/tx/{txid}',
	CHC: 'http://104.238.153.140:3001/tx/{txid}',
	CHIPS: 'http://chips.komodochainz.info/tx/{txid}',
	CMM: 'https://explorer.commercium.net/tx/{txid}',
	COLX: 'https://chainz.cryptoid.info/colx/tx.dws?{txid}',
	COQUI: 'https://explorer.coqui.cash/tx/{txid}',
	CRC: 'http://explorer.cryptopros.us/tx/{txid}',
	CRDS: 'http://explorer.crds.co/tx/{txid}',
	CREA: 'https://chainz.cryptoid.info/crea/tx.dws?{txid}',
	CRW: 'https://chainz.cryptoid.info/crw/tx.dws?{txid}',
	CRYPTO: 'https://crypto.kmdexplorer.io/tx/{txid}',
	DASH: 'https://chainz.cryptoid.info/dash/tx.dws?{txid}',
	DEX: 'https://dex.kmdexplorer.io/tx/{txid}',
	DGB: 'https://digiexplorer.info/tx/{txid}',
	DIN: 'https://explorer.dinerocoin.org/tx/{txid}',
	DNR: 'http://denariusexplorer.org/tx/{txid}',
	DOGE: 'http://dogechain.info/tx/{txid}',
	DOPE: 'https://chainz.cryptoid.info/dope/tx.dws?{txid}',
	DSEC: 'https://dsec.ac/tx/{txid}',
	DSR: 'http://desire.thecryptochat.net/block.php?hash={txid}',
	DYN: 'http://dyn.blocksandchain.com/tx/{txid}',
	EFL: 'https://chainz.cryptoid.info/efl/tx.dws?{txid}',
	ELI: 'http://explorer.elicoin.net/?page=tx&id={txid}',
	ELP: 'https://elp.overemo.com/transaction/{txid}',
	EMC2: 'https://chainz.cryptoid.info/emc2/tx.dws?{txid}',
	ERC: 'https://chainz.cryptoid.info/erc/tx.dws?{txid}',
	ETH: 'https://etherscan.io/tx/{txid}',
	ETOMIC: 'https://etomic.kmdexplorer.io/tx/{txid}',
	FAIR: 'https://chain.fair.to/transaction?transaction={txid}',
	FJC: 'http://explorer.fujicoin.org/tx/{txid}',
	FLO: 'https://florincoin.info/tx/{txid}',
	FRK: 'https://cryptobe.com/tx/{txid}',
	FTC: 'https://fsight.chain.tips/tx/{txid}',
	GAME: 'https://blockexplorer.gamecredits.com/transactions/{txid}',
	GBX: 'http://explorer.gobyte.network:5001/tx/{txid}',
	GLD: 'https://chainz.cryptoid.info/gld/tx.dws?{txid}',
	GLT: 'https://explorer.globaltoken.org/tx/{txid}',
	GLXT: 'http://glx.info/tx/{txid}',
	GRLC: 'https://garli.co.in/tx/{txid}',
	GRS: 'http://groestlsight.groestlcoin.org/tx/{txid}',
	HODL: 'https://hodl.kmdexplorer.io/tx/{txid}',
	HODLC: 'http://hodl.amit177.cf:1781/tx/{txid}',
	HTML: 'https://html.mastercalls.io/tx/{txid}',
	HUC: 'https://www.huntercoin.info/blockExplorer/tx/{txid}',
	HUSH: 'https://explorer.myhush.org/tx/{txid}',
	HXX: 'https://chainz.cryptoid.info/hxx/tx.dws?{txid}',
	I0C: 'https://chainz.cryptoid.info/i0c/tx.dws?{txid}',
	INN: 'http://explorer.innovacoin.info/tx/{txid}',
	IOP: 'http://mainnet.iop.cash/tx/{txid}',
	JUMBLR: 'https://jumblr.kmdexplorer.io/tx/{txid}',
	KMD: 'https://kmdexplorer.io/tx/{txid}',
	KNG: 'https://explorer.kings.ag/tx/{txid}',
	KREDS: 'https://www.kredsexplorer.com/tx/{txid}',
	KV: 'https://ceal.kmdexplorer.io/tx/{txid}',
	LBC: 'https://explorer.lbry.io/tx/{txid}',
	LTC: 'https://bchain.info/LTC/tx/{txid}',
	LTZ: 'https://explorer.litecoinz.info/tx/{txid}',
	MAC: 'https://explorer.machinecoin.org/tx/{txid}',
	MESH: 'https://mesh.kmdexplorer.io/tx/{txid}',
	MGW: 'https://mgw.kmdexplorer.io/tx/{txid}',
	MLM: 'https://info.mktcoin.org/tx/{txid}',
	MNX: 'https://minexexplorer.com/?r=explorer/tx&hash={txid}',
	MNZ: 'https://www.mnzexplorer.com/tx/{txid}',
	MONA: 'https://mona.chainsight.info/tx/{txid}',
	MOON: 'https://chainz.cryptoid.info/moon/tx.dws?{txid}',
	MSHARK: 'https://mshark.kmdexplorer.io/tx/{txid}',
	MUE: 'https://chainz.cryptoid.info/mue/tx.dws?{txid}',
	MVP: 'http://mvp.explorer.supernet.org/tx/{txid}',
	MZC: 'http://mazacoin.thecoin.pw/tx/{txid}',
	NAV: 'https://chainz.cryptoid.info/nav/tx.dws?{txid}',
	NMC: 'https://namecoin.webbtc.com/tx/{txid}',
	OOT: 'http://explorer.utrum.io/tx/{txid}',
	ORE: 'https://explorer.galactrum.org/tx/{txid}',
	PAC: 'http://usa.pacblockexplorer.com:3002/tx/{txid}',
	PANGEA: 'https://pangea.kmdexplorer.io/tx/{txid}',
	PEW: 'http://explorer.brofist.online/tx/{txid}',
	PGN: 'http://explorer.pigeoncoin.org/tx/{txid}',
	PIVX: 'https://chainz.cryptoid.info/pivx/tx.dws?{txid}',
	PIZZA: 'https://pizza.kmdexplorer.io/tx/{txid}',
	POLIS: 'https://explorer.polispay.org/tx/{txid}',
	PURA: 'https://chainz.cryptoid.info/pura/tx.dws?{txid}',
	PYRO: 'http://138.68.246.198:3001/tx/{txid}',
	QMC: 'http://136.243.26.230/tx/{txid}',
	QTUM: 'https://explorer.qtum.org/tx/{txid}',
	RADIUS: 'http://explorer.radiuscrypto.online/tx/{txid}',
	RAP: 'http://explorer.our-rapture.com/tx/{txid}',
	REVS: 'https://revs.kmdexplorer.io/tx/{txid}',
	ROGER: 'https://explorer.theholyroger.com/tx/{txid}',
	ROI: 'https://roi-coin-blockexplorer.roi-coin.com/tx/{txid}',
	RVN: 'http://threeeyed.info/tx/{txid}',
	SBTC: 'http://block.superbtc.org/tx/{txid}',
	SCRIV: 'http://explorer.scriv.network/tx/{txid}',
	SEQ: 'https://seq.blocksandchain.com/tx/{txid}',
	SIB: 'https://chain.sibcoin.net/en/tx/{txid}',
	SMART: 'https://explorer3.smartcash.cc/tx/{txid}',
	SMC: 'http://smartchain.cc/tx/{txid}',
	SPK: 'http://explorer.sparkscoin.io/tx/{txid}',
	STAK: 'https://straks.info/transaction/{txid}',
	STRAT: 'https://cryptobe.com/tx/{txid}',
	SUPERNET: 'https://supernet.kmdexplorer.io/tx/{txid}',
	SXC: 'http://blockexplorer.lavajumper.com/tx/{txid}',
	SYS: 'https://chainz.cryptoid.info/sys/tx.dws?{txid}',
	TRC: 'https://explorer.terracoin.io/tx/{txid}',
	UFO: 'https://chainz.cryptoid.info/ufo/tx.dws?{txid}',
	UIS: 'https://explorer.unitus.online/tx/{txid}',
	UNO: 'https://chainz.cryptoid.info/uno/tx.dws?{txid}',
	VIA: 'https://chainz.cryptoid.info/via/tx.dws?{txid}',
	VIVO: 'https://chainz.cryptoid.info/vivo/tx.dws?{txid}',
	VOT: 'http://explorer.votecoin.site/tx/{txid}',
	VRSC: 'https://explorer.veruscoin.io/tx/{txid}',
	VRT: 'http://213.183.45.119:3001/tx/{txid}',
	VTC: 'https://bitinfocharts.com/vertcoin/tx/{txid}',
	WAVI: 'http://www.wavi-blockchain.cloud/tx/{txid}',
	WLC: 'https://wlc.kmdexplorer.io/tx/{txid}',
	XCOIN: 'http://xcoin.ddns.net/tx/{txid}',
	XMCC: 'http://block.monacocoin.net:8080/tx/{txid}',
	XMY: 'https://cryptap.us/myr/explorer/tx/{txid}',
	XRE: 'http://revolvercoin.org:3001/tx/{txid}',
	XSG: 'https://explorer.snowgem.org/tx/{txid}',
	XSN: 'https://xsnexplorer.io/transactions/{txid}',
	XZC: 'http://explorer.zcoin.io/tx/{txid}',
	ZCL: 'http://explorer.zclmine.pro/tx/{txid}',
	ZEC: 'https://explorer.zcha.in/transactions/{txid}',
	ZEL: 'http://explorer.zel.cash/tx/{txid}',
	ZER: 'http://zeroexplorer.forgetop.com/tx/{txid}',
	ZET: 'https://chainz.cryptoid.info/zet/tx.dws?{txid}',
	ZILLA: 'https://www.zillaexplorer.io/tx/{txid}',
	ZOI: 'https://chainz.cryptoid.info/zoi/tx.dws?{txid}',
}));

const blockExplorer = {};

blockExplorer.tx = (symbol, txid) => {
	ow(symbol, ow.string.label('symbol'));
	ow(txid, ow.string.label('txid'));

	const explorer = explorers.get(isEtomic(symbol) ? 'ETH' : symbol);

	// Fallback
	if (!explorer) {
		return `https://www.google.com/search?q=${symbol} Transaction ${txid}`;
	}

	const explorerUrl = explorer.replace('{txid}', txid);

	return explorerUrl;
};

export default blockExplorer;
