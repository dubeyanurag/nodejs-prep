
---
title: "Security & Monitoring Interview Questions"
category: "security-monitoring"
subcategory: "comprehensive"
difficulty: "advanced"
estimatedReadTime: 60
questionCount: 52
lastUpdated: "2025-01-10"
tags: ["security", "monitoring", "authentication", "authorization", "encryption", "observability", "compliance"]
companies: ["Google", "Amazon", "Microsoft", "Meta", "Netflix", "Stripe", "Uber"]
frequency: "very-common"
---

# Security & Monitoring Interview Questions

## Quick Read (10-15 minutes)

### Executive Summary
Security and monitoring are critical aspects of backend engineering that ensure system integrity, data protection, and operational visibility. This comprehensive guide covers authentication/authorization patterns, encryption strategies, performance monitoring, observability practices, and compliance frameworks essential for senior backend roles.

### Key Security Concepts
- **Authentication vs Authorization**: Identity verification vs permission management
- **Zero Trust Architecture**: Never trust, always verify security model
- **Defense in Depth**: Multiple layers of security controls
- **Principle of Least Privilege**: Minimal access rights for users/systems
- **Security by Design**: Building security into system architecture

### Key Monitoring Concepts
- **Observability Triangle**: Metrics, logs, and traces
- **SLI/SLO/SLA**: Service level indicators, objectives, and agreements
- **Golden Signals**: Latency, traffic, errors, and saturation
- **Distributed Tracing**: Request flow across microservices
- **Alerting Fatigue**: Balance between coverage and noise

### TL;DR
Security focuses on protecting systems through authentication, authorization, encryption, and compliance frameworks. Monitoring provides operational visibility through metrics, logs, traces, and alerting to ensure system reliability and performance.
```

);
  }
}});' faileder creation  'Ordon({ error:s(500).jses.statu
    
    ror');d', 'errterder_creant('oEverackBusinessetrics.tervability.m    obs    
    });
r.id
Id: req.use  userId,
    ion correlat{
     or, ed', errilion fader creat.error('Oringlity.loggobservabi   r) {
  (errocatch } 
    );
  }  '
   pe': 'create.tyonperati        'oervice',
-s': 'orderamervice.n 'se
       },
      {     
 on(order);.js res       
   });
         
    user.iderId: req. us        .id,
  order   orderId:    nId,
   correlatio          {
 y', successfullder creatednfo('Or.logging.itylivabi       obser
        ;
 reated')r_csEvent('ordeines.trackBusetricsility.m  observab
      s metricack busines Tr        //       
dy);
 eq.bo(rcreateOrdert = awaist order 
        conss logic  // Busine   
       });
          dy.type
  q.boype: rederT      or   r.id,
 eq.use userId: r
         ionId,lat    corre   ', {
   orderCreating ging.info('vability.logser        ob        
     });
type
   : req.body.ype'order.t '        r.id,
 id': req.use     'user.({
     Attributes span.set    {
   n) => sync (spa   a,
   ate-order'    'creSpan(
  thcuteWitracing.exeervability.obs
    await try {  ;
  
tionIdorrelaonId = req.cst correlati{
  cons) => q, re', async (reders('/api/orapp.postbility
observa logic with usiness bxample E

//ints(app);.setupEndpobility
observa(app);wareddley.setupMiilit
observabyrvabilit/ Setup obseice();

/yServrvabilit new Obseervability = obsst
conexpress();app = nst ess app
con Expr Usage i
}

//}
  }lse;
    n fa
      retur } catch {;
    return trueg();
     pinwait db.y {
      aes
    trencindritical depe // Check cess() {
    checkReadin  
  async);
  }
);
    }y }json({ read503). 200 : s(ready ?atues.st  r;
    diness().checkReaawait thisy = t read    constraffic
  o receive ready tis  if service     // Checks) => {
  , re (reqsync', a('/readyp.get ap check
   eadiness// R   
    );
 lth);
    }on(heae).jss(statusCodatu.st
      res: 503;00 ? 2= 'healthy' s ==alth.statuusCode = heconst stat
      ckHealth();h.cheltait this.hea awth =  const heal => {
    req, res)ync ( as'/health', app.get(
   pointeck endealth ch  
    // H
  
    });s());tMetricetrics.gehis.mt t(awai     res.ende);
 contentTypster.regiics.', this.metrt-Type.set('Conten    res {
  req, res) =>', async (etrics app.get('/m
   us Prometheorndpoint f// Metrics e {
    s(app)etupEndpointnts
  s endpoiservability
  
  // Ob;
  }    })();
    next   });
  r?.id
   usereq.userId: ,
        elationIdd: req.correlationI    corr  ),
  t'User-Agenet('q.gnt: reAge user,
       : req.url
        urlhod,ethod: req.m met     t', {
  RequesTP info('HThis.logging. {
      t next) => res,req,  app.use((re
  ewaiddl mingst loggque
    // Re ());
   csMiddlewaretrics.metrihis.me   app.use(tre
 lewaiddrics m // Met;
    
   e())ewardlonMid.correlatioggingse(this.l    app.uware
leD middion I/ Correlat   /app) {
 e(upMiddlewarsetup
  are setiddlew Express m 
  //);
  }
   };
    }
     * 100)MB)pTotalheaMB / (heapUsedath.round(: McentePereapUsag      h  
talMB),und(heapToroth.alMB: Maot    heapT,
    dMB)Useround(heapth.MB: MasedeapU   h   rning',
  'waalthy' :  ? 'he 500B <s: heapUsedM  statu
      urn {     ret 
 ;
     24 / 1024otal / 10pTe.heaB = usagpTotalMconst hea   1024;
   ed / 1024 / age.heapUsB = usst heapUsedMon);
      cUsage(ss.memoryroce usage = pconst{
       =>  ()yncas, y'ck('memorCherHealthisteealth.regs.hhi
    t checkusage/ Memory    
    /  });
 althy');
  nheAPI ur('External row new Erroponse.ok) th(!res
      if lth');l.com/heaapi.externaps://t fetch('httaiawponse = resonst  c
     ) => { (', asyncternal-apipendency('exh.registerDehis.healtcheck
    tI health nal APxter E
    //  });
    
  ();edis.pingawait r
       {) =>, async (y('redis'rDependench.registeis.healtck
    thlth che Redis hea   
    // });
 ing();
   it db.pn
      awaonnectioase c Check datab    // => {
   async ()('database',erDependencyistealth.reg this.h
   heckse health cDataba // 
   s() {lthCheck
  setupHea  );
  }
hChecks(Healtthis.setup
        ervice();
HealthSlth = new    this.hea);
 rvice(ew TracingSe.tracing = nhis);
    tingService( = new Loggs.logging;
    thivice()ricsSerw Metrics = nemetthis.{
    () oronstructice {
  cervbilityServass Obs setup
clabservabilityete o

// Compl
  }
}ults;rn resretu
    
       }
    }thy';
   'unhealtus = s.sta      result      };
  message
  rror: error.          enhealthy',
  status: 'u        me] = {
na.checks[ results     rror) {
  } catch (e       }
    ;
   healthy'= 'uns.status esult   r
       healthy') { !== 'statust.  if (resul   esult;
   = rhecks[name]    results.cck();
      await chest result =
        con   try {ks) {
   althCheche this.ck] of che[name,(const 
    for h checksltk custom hea Chec
    //     }
    }
thy';
     = 'unhealstatus ts.    resul};
    e
        agrror.mess  error: e
        althy',atus: 'unhe     st
     = {s[name] cksults.che   reor) {
      (errch   } cat     };
      - start
 Date.now() me:onseTiresp          lthy',
: 'hea   status
       ame] = {ks[nchecresults.
        ck();wait che  a     now();
 ate.art = Dnst st     co  try {
    {
    encies).dependk] of thisec[name, cht   for (cons
  denciesheck depen   // C    
    };
}
 s: {      checknknown',
ION || 'u_VERSCE.SERVIprocess.env   version: 
   wn', || 'unkno_NAMESERVICEocess.env.ervice: pr,
      sring()SOSt).toIw Date(amp: nemest',
      tiealthy'h:     status
  esults = {st r{
    conkHealth()  async chec}
  
 ck);
  ame, che(nhecks.sethis.healthC  theck) {
   ce,thCheck(namgisterHealeck
  re chstom healthcuter egis 
  // R}
 );
  hChecke, healtset(namies.is.dependenck) {
    thhChece, healtncy(namendegisterDepheck
  reth ccy healter dependenegis // R  }
  
 ();
w MapChecks = nehis.healthp();
    ties = new Mandenc   this.depe
 ctor() {nstruco
  thService {
class HealngLI monitori and Sth checkHeal
}

// 
  }  }    });
  alue);
  bute(key, vAttri    span.set => {
    , value])h(([keyforEacattributes).ntries(    Object.e{
  an)     if (sp;
iveSpan()ctce.getAetry.tra opentelemnst span = co
   utes) {tribtes(attribu addSpanAtspan
 rent tes to curtom attribu/ Add cus  /
  
});
  }    
      }
();pan.end    s    
inally {
      } fhrow error;;
        t      })
  age .messoressage: err      mOR, 
    tusCode.ERRnStaSpay.ntelemetrode: ope        c({ 
  usatspan.setSt    );
    (erroronrdExcepti   span.reco    {
   (error) } catchult;
     eturn res      r.OK });
  tusCodeanStalemetry.Sptede: opentus({ coetStan.s
        spaion(span);ait operatesult = awnst r   co{
          try 
 span) => {c (asynibutes }, e, { attrn(namiveSpa.startAct this.tracereturn {
    r= {})butes ttriperation, apan(name, oxecuteWithS
  async espanstom / Create cu }
  
  /0.0');
 rvice', '1.er('user-seac.trace.getTrelemetry= opentacer    this.tr.start();
   this.sdk
    
  
    }); be addedwillions ntat-instrume [] // Autotations:trumen   ins   }),
   '
   acespi/tr:14268/a://localhost|| 'httpENDPOINT GER_nv.JAEprocess.eendpoint: 
        ter({gerExpornew Jaerter: raceExpo{
      tSDK(w Nodenes.sdk = hi tr() {
    constructo
  {gServices Tracin
claspetu suted tracingistrib// D
  }
}

 };id
   ess.p: proc     pid),
 stname(').hoire('osame: requ   hostnpanId,
    sId,
     race      t,
..meta  .rn {
    retu
    ;
    xt()?.spanIdntespan?.spanCot spanId = cons    ?.traceId;
panContext()?.s spanId =ace tr const
   iveSpan();tActe.gemetry.tracn = openteleconst spa
    meta) {Meta(
  enrich
  
  }eta(meta));enrichMhis.e, tmessagger.debug( this.log}) {
   eta = {ssage, m  debug(me  

  }
ta));meichMeta(e, this.enr(messaglogger.warn{
    this. {}) age, meta =  warn(mess
  }
  
   }));
 sage?.mesrrororMessage: e    errrror,
  ck || eta error?.s      error:a,
...met      
({ichMetaenrthis.ge, or(messa.logger.err
    this = {}) {or, metaerrsage, 
  error(mes
    }ta(meta));
chMee, this.enrio(messagger.inf.log  this= {}) {
  eta (message, m
  info methodsogginged l  // Enhanc
  }
  
, 9)}`;substr(236).ing(toStrm().doh.ran${Mat.now()}-${Datereturn `
    ionId() {rrelatateCo
  gener }
  };
    
  next();Id);
     rrelation-id', req.cotionx-correlader('tHea res.se        
  Id();
 eCorrelationeratthis.gen                        id'] || 
 st-rs['x-requeeade req.h                    '] || 
    rrelation-idrs['x-coeq.heade rtionId =.correla
      req next) => {q, res,n (retur    re() {
iddlewareonM
  correlatin IDorrelatiodd cleware to a 
  // Midd
  }
 
    });)
      ]   }    
 g' ned.loombiogs/cme: 'lnalefi          
File({ ransports.nston.t     new wi}),
        ror' 
   vel: 'er      leg', 
    ogs/error.loname: 'lfile          le({ 
nsports.Fion.trainst      new wnsole(),
  ransports.Conston.t new wi   [
     ransports: t   ),
         })
          });
eta
       ..m      .    
  erId,eta.usserId: m         ud,
   meta.spanInId:         spaaceId,
    .tr metad:traceI      nId,
      ioatorrelta.c meId:ation    correl
        'unknown',VERSION || ICE_.env.SERV process   version:
         own',nknME || 'uVICE_NAcess.env.SERce: pro      servi     
   message,
          l,     leve       stamp,
    time       fy({
 .stringi JSON    return   
   eta }) => {ge, ...m, messastamp, level(({ timemat.printf winston.for       n(),
format.jsoton.    wins   rue }),
  stack: tt.errors({ston.forma win,
       .timestamp()ormatn.f   winstone(
     format.combin.at: winsto form',
     | 'infoG_LEVEL |ocess.env.LOevel: pr   lgger({
   ton.createLo= winsthis.logger     uctor() {
 {
  constrgingServiceass Log setup
clgingured logStruct

// 
}
  }trics();egister.mern this.r {
    retucs()c getMetring
  asynrapitheus scr Promet metrics fo/ Ge
  
  / });
  }
         statusnown',
| 'unkICE_NAME |v.SERVrocess.enservice: pype,
      : eventTent_type    evs.inc({
  tricbusinessMe
    this.ess') {s = 'succ, statupetTyt(evenenkBusinessEv  tracracking
s tiness metric
  // Bus};
  }
  ext();
     
      n
          });els);
 al.inc(labotstTque.httpRe   this;
     tion), durabelsn.observe(laquestDuratioRe.http  this           
  
     };    nknown'
| 'uVICE_NAME |v.SERenocess. prervice:
          sCode,uss.stattus_code: re   sta       h,
 req.patpath ||route?.req.e:       rout  
  .method,method: req       = {
   st labels 
        con00; / 10 - start)()nown = (Date.t duratio    cons> {
    inish', () = res.on('f     
     now();
 tart = Date.     const s {
  =>, res, next)eqrn (rture    e() {
lewarMidd metricscs
  HTTP metrict colleare toewiddl // M
  }
  
 cs);nessMetrihis.busiMetric(tr.registertehis.regisns);
    tiotiveConnecthis.acric(tterMetister.regishis.reg;
    tquestTotal)is.httpReic(thregisterMetrister.    this.regtion);
tDuraes.httpRequric(thisterMetr.registe.regishisics
    tster metrRegi/     /);
    
 }s']
   atuervice', 'st 'st_type',ames: ['evenlN
      labes',ntbusiness eveotal   help: 'T
    otal',events_t'business_     name: nter({
 eus.Coueth= new proms ricnessMetthis.busi   
    ;
    })']
 ['servicelabelNames: ',
      ionscttive conneac'Number of lp: 
      hes',nectiononive_cact: ' name     auge({
rometheus.Gions = new ptiveConnect
    this.ac
     });vice']
    'sertatus_code','route', 'smethod', es: ['belNam,
      larequests'P TTumber of H 'Total nlp:
      hets_total',ttp_reques name: 'her({
     Counts.ometheuw prtal = neTottpRequest  this.h      

    });
5, 7, 10], 0.7, 1, 3, 3, 0.5ts: [0.1, 0.
      buckeervice'],e', 'satus_cod'st 'route', od',ames: ['meth      labelN',
condsin seuests TTP req of Huration: 'Dlp
      he',econdsration_s_request_du'httpame:    n
   Histogram({etheus.= new promn ratiouestDuhis.httpReq    tetrics
ustom m  // C);
    
  s.register }ter: thics({ registriefaultMectDtheus.colleome  prs
  metricdd default  A
    //    
egistry();us.Rethew promster = neis.regith    egistry
 a R// Create    r() {
  constructo {
Serviceetricsus
class Mthemeh Pro wittrics setup// Me');

egerorter-ja/explemetry@openteuire('ter } = reqgerExpor Jaenst {');
coions-noderumentatnstto-itry/au@openteleme('uirereqDK } =  NodeSt {);
consi'y/apemetrntelope'@ require(lemetry =st openteston');
conire('win requst winston =
conm-client');re('prous = requitheonst promeress');
cire('expqu = reonst expressavascript
c**
```jCode Exampleher:

**ing togetg work tracintedand distriburics, logs, equires mety rabilitive observensehes)**
Compr5 minutr (3-ailed Answe

**Deting.rtng with alerionito SLI/SLO mging, anded logs, structuron IDe correlati. Uses (Jaeger)d tracanlogs (ELK), theus), trics (Prome mes:e pillart the threplemenonds)**
Im(30 secick Answer 

**Qumon:** Very ComFrequency Airbnb | **ix, Uber,Netfl** nies:or | **Compaty:** Senificulifrvices
**Dr microse fogyility strateabervsive obshena compregn ### Q6: Desiics

#ility & MetrObservabns)

### + Questios (20onoring Questionitormance M## Perf

ems

---ystw scro es
- Keytieshori autificateCert
- ignaturesigital s
- Dopics***Related Tn?

*atio verificion and distribute keyandlu h How do yot?
3.importand why is it gorithm anchet alDouble Ratthe . What is cy?
2ward secrect for perfelementdo you impow . H*
1ions*st Quelow-upies

**Folraroven libnstead of prtom crypto iting cusmplemencity
- Inti authec keying publi validat Nottion
-umber genera random n Using weakcy
- secreting forwardNot implemenlaintext
- te keys in pivag pr
- Storinakes***Common Mistyption.

*email encrfor ses PGP  uotonMailtion. Prencrypor E2E  Protocol fents Signalimplemp cy. WhatsApard secrem for forwet algorithtchs Double RaProtocol use**
Signal extrld ContWoReal-``

**}
});
`  ' });
ion faileddecryptd or ss denie'Acceror:  erjson({403).es.status( {
    rrror) (etch
  } casage);edMescryptn(deres.jso    ;
    

    )Idpient  reci,
    messageId
      sage(esceiveM.recegeServimessa = await essageptedMonst decry c;
    
   .idusertId = req.nst recipien
    co.id;eq.paramsId = rt message constry {
   
  res) => {sync (req,  asages/:id',esi/mt('/app.ge

ap
});age });
  }sserror.merror: { e.json(s(500)tu   res.star) {
 rrotch (e});
  } caeId son({ messags.j   re);
    
    
   messagetIds,
      recipienId,
    senderge(
      Messasende.vicsageSerait messsageId = aw   const me
 r.id;
    useeq.nderId = r    const sey;
 = req.bod message }ipientIds,ec  const { rry {
   t{
 es) => nc (req, r asymessages',.post('/api/points
app// API end;

ageService() SecureMesservice = newsageSconst mesxample

// Usage e;
  }
}
icKey }turn { publ   re;
    
 privateKey)y, cKerId, publir(use.storeKeyPait this  awai
  ore new keys/ St   /
    
 ;ys(userId)rchiveKehis.aawait t
    messagesld decrypting o for keys old / Archive   
    /;
 Pair()ateKeyyption.geners.encrit thi= awarivateKey } ublicKey, ponst { p  c{
  erId) usrKeys(eUseync rotat
  asriodically peyskete ota - recrecy/ Forward s
  /    }
vateKey);
e`, priprivat(`${userId}_.sethis.keyStore    tlicKey);
, pubublic`Id}_p{usere.set(`$.keyStory
    thister ke/masswordas user's py withte kevancrypt priion, educt// In pro{
    rivateKey) ublicKey, pId, pKeyPair(user async store}
  
 ivate`);
  _pr{userId}Store.get(`$.keyreturn this    er key
 user's mast with decryptuction,In prod// {
    rId) ey(usevateKync getPri as }
  
 ;
 }_public`)rId.get(`${uses.keyStore  return thi server
  secure keyfetch from on, n producti{
    // I) icKey(userId getPublync  as
  
ey };
  }licKubeturn { p
    r;
    Key)teKey, privapublicId, ir(usereyPas.storeK  await thiecurely
  s store key  // S    
  ();
ateKeyPairnerryption.gethis.ency } = await y, privateKeblicKe pu  const {Id) {
  eys(userserKenerateUt
  async ganagemen  // Key m}
  

    };
  mestampa.tiatdDtemp: encryp   timestaderId,
   ta.senryptedDarId: encsende  ge,
    ssa me{
     
    return     ;
    )ateKey
iv
      prd,ntI   recipie   Data,
 encrypted  ent(
   ecipiecryptForRncryption.d.eait thisessage = awconst m   ssage
 / Decrypt me
    /
    ntId);eKey(recipiegetPrivatawait this.y = ivateKeconst pr
    keys private nt'Get recipie
    //    
    }
 d');niess deError('Accethrow new       )) {
entIdecipi(rds.includesa.recipientIptedDat  if (!encrycess
  ient has acrify recip/ Ve
    /  
  ageId);Message(messthis.get= await a atdDencrypte
    const essageed mencryptt stored    // GeId) {
  recipientd,(messageIceiveMessagenc re
  asy
  }
   messageId;    return    
});
   tedData
 cryp
      ...enIds,ntipieec     r,
   senderId  ssageId,
  : me({
      idage.storeMesst this    awaiUID();
mUo.randogeId = cryptsa  const mesge
  ed messae encrypt Stor  
    // );
  eys
   icKecipientPubl      rmessage,
     ipients(
 ryptForRec.enc.encryption= await thisa encryptedDatst  consage
   ypt mes   // Encr   
 
    }
 ey;ublicKntId] = pipieeys[recentPublicKrecipi;
      ipientId)recblicKey(.getPuisawait thblicKey = const pu      ) {
Id]enders, scipientIdf [...red o recipientInst   for (co{};
    
 ublicKeys = t recipientP   consce)
 evir multi-der fouding send(inclts recipienll ys for at public ke   // Gessage) {
 ientIds, meciperId, resage(sendc sendMes
  
  asyntorage
  }key sse secure ction, u produ Inp(); // = new Matorethis.keySe();
    Serviccryption E2EEn newncryption =   this.e) {
 r( constructo
 Service {ageeMessecur Sption
class2E encry Ee withrvicsage seMes/ 
}

/
  }ssage;   return me  
 icKey);
  etressage, symmedM(encrypttMessageypthis.decr message = st con
   message// Decrypt    ;
    
 eKey)ivatyptedKey, pry(encrptKe.decrythisy = Kemmetric   const syy
 ke symmetric  Decrypt
    //    se64');
 'bantId],[recipieryptedKeysm(encfer.froufKey = Bst encrypted    conipient
recr this fopted key et encry    // G    

edData;crypt} = encryptedKeys age, enryptedMess{ enc const ey) {
   , privateKientIddData, recipent(encryptetForRecipi decrypasync  ent
cipireific  specssage for/ Decrypt me }
  
  /
 
    };.now()atetamp: Desim teys,
     edKypt encr     
edMessage,  encrypt
      return {
    
   }
   'base64');).toString(KeycKey, publicsymmetriey(ryptKis.encth] = ipientIddKeys[rec   encrypte  cKeys)) {
 ipientPubli.entries(rec] of Objectd, publicKeytIcipienonst [re  for (c  ;
= {}Keys tedconst encrypt
    ach recipien key for eetric symmEncrypt  // );
    
  cKeyge, symmetriessage(messaencryptM= this.tedMessage onst encryp  cey
  ymmetric kage with s mess  // Encrypt 
  Key();
   teSymmetrics.generaey = thiricKymmetnst sage
    comessor this y ftric kemeate sym   // GenerKeys) {
 ntPublicieipage, recssents(mecipiencryptForRe
  async  flowption2E encrye E// Complet
  }
  
  ted;eturn decryp
    r
    utf8');r.final('eciphe += d   decryptedtf8');
 'hex', 'ued, yptate(encrcipher.updrypted = deet dec   l
 
    );ag, 'hex')m(t.froBufferag(tAuthTr.sedeciphe  
       );
')
   rom(iv, 'hex.fuffer   B,
     key    m,
s.algoriththir(
      ipheo.createDec= cryptt decipher ons   c
    
 cryptedData;= en } , tagivcrypted, const { en
     { key)dData,encryptesage(es decryptMtric key
 ymmeith se wypt messag Decr
  // }
 };
  
    ex')String('hg.to  tag: tax'),
    'heString(iv.to    iv: rypted,
     encurn {
       ret
    
g();thTaer.getAuiphnst tag = cco      
  'hex');
pher.final(ed += ciptncry');
    e'utf8', 'hexte(message, pdapher.ued = cilet encrypt   
    iv);
 , , keylgorithmpher(this.ato.createCier = crypnst ciph);
    cogthivLenmBytes(this.crypto.rando const iv = key) {
   ssage, tMessage(meryp
  enckeyh symmetric message witt  // Encryp
   );
  }
ncryptedKey  }, e'sha256'
  oaepHash: NG,
      ADDIP_PS1_OAEts.RSA_PKCstancrypto.con  padding: 
    teKey,ey: priva({
      kateDecryptcrypto.privurn ) {
    reteyivateKdKey, prypteyptKey(encrey
  decrth private ktric key wi symmeypt Decr  //
  
y);
  }metricKe
    }, sym56'ash: 'sha2    oaepHADDING,
  EP_PS1_OAKCtants.RSA_Pcrypto.consding: pad
      icKey,y: publ
      kecrypt({blicEnpto.pun cry
    retur) {icKeycKey, publmetrisymcryptKey(  enpublic key
ecipient's key with rt symmetric ncryp
  // E
  }
  gth);is.keyLenBytes(tho.randomyptn cr    retur {
metricKey()ymerateSn
  geniocryptage enr messtric key foate symme
  // Gener 
 
  }ivateKey }; prublicKey,turn { p  re  
      });
 }
  pem'
       format: '    'pkcs8',
   type:       {
  coding:eyEnvateK
      pri   },   '
 'pemt:   forma   i',
  e: 'spk   typ    oding: {
 ublicKeyEnc  p
    : 2048,dulusLength
      mo)('rsa', {rateKeyPaireneify(crypto.gomis} = await preKey y, privatublicKe   const { p{
 eKeyPair() ync generat
  asserr each ur fo RSA key paienerate 
  // G
 }  8 bits
16; // 12th = enghis.tagL t   ts
bi8  // 12 = 16; s.ivLength   thi56 bits
 ; // 2= 32.keyLength  this
   es-256-gcm';gorithm = 'a   this.al) {
 nstructor(ice {
  coonServncrypti2EE E
class
e('util');} = requiry ifnst { promis
co'crypto');o = require(cryptonst ascript
c
```javle***Code Examp

*s plaintext:an acces crecipientsly intended uring onensest, and at rt a in transirotects datncryption pnd-to-end etes)**
Einu3-5 mnswer (Detailed A

**nt.managemey roper kewith pata, for dion rypttric encsymmend  exchange ahy for keyrapkey cryptogc-blit using pu. Implemenatan decrypt d caeceiverd rder any senensures onlon ypti*
E2E encr0 seconds)*k Answer (3icn

**Quncy:** Commo| **Freque Stripe WhatsApp,, Signal:** esCompani | **ior* Sen:*ultyifficve data
**Dr sensitiryption fo-to-end enclement endImp#### Q5: tion

tecroData Pption & Encry

### 

---ationiz author API Gatewaycopes
-
- OAuth sontroled access cbas Policy-cs**
-ated Topi**Relrchies?

 hieraolex rcomple in itancesion inherandle permis you h do?
3. Howsts)s Control Lices (Acand ACLen RBAC fs betweade-of are the tr2. What (ABAC)?
ess Controlcc Aibute-Basednt Attrimplemeou w would y
1. Houestions**low-up Qs

**Foln changemissioiting per Not audes
-ctur strusionmplex permisly cos
- Overissioned permcontext-basonsidering egy
- Not c stratonativalidut insions withohing permis Cacoperly
-y pr hierarchting roleNot implemen
- stakes**on Mi
**Comm
ission sets.rmnd pecontrol aed access le-basofipr with ts RBACplemence imesfors. Salssion permiedasicy-bBAC with polAM uses R I*
AWSext*-World Contal`

**Re  }
);
``on(order);
es.js
    
    r });
    }nied'ess de 'Accrror:({ e).jsons.status(403 return re  ) {
   ccess if (!hasA
    
       ); }
serIdr.unerId: orde{ resourceOwad',
      
      'reer',ord
      'r.id,req.useion(
      ssermibac.hasP await rs =asAcces   const h);
    
 .id.paramsfindById(req Order.waitorder = aconst  {
    , res) =>async (reqToken,
  cateti,
  authenders/:id'pi/or.get('/ack
appission cheermnamic p/ Dy
/ }
);
(users);
    res.json
 d();ser.finrs = await Uuse    const  res) => {
req,
  async (),ser', 'read'on('uePermissi.requiracoken,
  rbteTntica
  authe', erset('/api/uscheck
app.gon th permissi route wiess;

// ExprCService()RBA = new st rbacmples
consage Exa
// U);
  }
}
erId}`s:${uspermissione(`user_elethe.dermissionCac.p
    thisr cacheClea
    //    });
    }
  e._ids: rol{ roleull:     $p, {
  userIde(AndUpdatdById User.fin  await
    
  nd');
    }ouRole not few Error('throw n) {
         if (!role });
 leName name: rodOne({t Role.finwaile = a ro   const {
 me)NaleId, ro(usereRolerevokync   as 

  }
 {userId}`);missions:$(`user_perhe.deleteionCacisserm
    this.pClear cache   // );
    
  }  _id }
 les: role.ToSet: { rodd  $a, {
    e(userIdatUpdindByIdAndwait User.f a     
;
    }
  ound')le not fror('Row Er ne  throw
    ole) {if (!r });
    ue trve:ame, isActiame: roleN.findOne({ nt Roleole = awai rnste) {
    cod, roleNamnRole(userIasync assignagement
  Role ma  
  // 
ionMap;
  }issn permur 
    ret);
   ;
    }      }ete`)
rce}:delouhas(`${resssions.lete: permi     de`),
   pdateurce}:us(`${reso.harmissions: pe  update),
      }:read`{resourceons.has(`$ermissiad: p   re`),
     urce}:create(`${resoissions.has: perm      create  ] = {
resourcemissionMap[{
      perresource => h(rces.forEacresou   ;
    
 {}onMap = st permissi  conserId);
  issions(userPerm this.getUns = awaitissiot perm    consurces) {
erId, resoonMap(usserPermissi  async getUk for UI
ion chec permiss Bulk//
  
      };
  };
      }
' })iledheck faorization c: 'Authror).json({ er00.status(5  res     (error) {
 catch );
      } xt(
        ne       }
         );
       }}`
   :${actionesource}`${rquired:      re  s',
     permissionient ficror: 'Insuf er           ).json({ 
403s.status(n reur  ret
        ess) { (!hasAcc
        if;
        
        )xt || {}.contereq   , 
             action  urce, 
          resoerId, 
           usn(
 sPermissiothis.haait sAccess = awconst ha
        eq.user.id;rId = rusenst 
        co      try {=> {
, next)  (req, resurn async    reton) {
 actiurce,sion(resorePermisjs
  requir Express.re fo// Middlewa
  
  true;
  }
    return     nt;
    }
partmeceDentext.resour= cot ==er.departmenurn us
      retId);ById(user.findait User = awerst us
      con{ly) artmentOnons.depn.conditiissio (perm    
    if
    }
;serId === uIdceOwnerurt.resoontexturn crey) {
      esourceOnlownRditions.n.con (permissio 
    if;
   ction })e, ane({ resourcsion.findOPermisawait ermission = st pces
    conurwn resoss their occeonly ar can ck if use Che // Example:t) {
   ontextion, cacsource, d, res(userIditionnConeckPermissio
  async ch;
  }
  ontext)n, cioe, acturc resoerId,ditions(usrmissionConeckPe.chit thiseturn awa    rded
ons if neenal conditiheck additio/ C /    
   
    }
turn false;      reKey)) {
(permission.has!permissions  
    if (;
  ion}`:${acturce}ey = `${resonKissiopermconst d);
    rIssions(useUserPermiit this.get awamissions =nst per   co {}) {
  =ontexttion, cacresource, d, n(userIssioync hasPermi
  
  ass;
  }ermission p   return
    
 
    });Date.now()mp:     timestassions,
     permiy, {
   acheKeset(che.ssionCacmi  this.pere result
  ache th  
    // C }
  
   );le(roleessRorocwait p {
      aer.roles)le of usro for (const 
    
    };  }
   
    ntRole);pareocessRole(  await pr    s) {
  lerentRole.pale of roentRost par (con     fortance)
 oles (inherirent rrocess pa   // P
           });
 
   );m.action}`${perm.resource}:{perns.add(`$  permissio  => {
    ch(perm sions.forEale.permis     rormissions
 e pe/ Add rol  
      /  ;
  ())id.toStringd(role._es.adcessedRol pro    
        }
  urn;
    ret       sActive) {
.ile|| !ro()) ngri._id.toStes.has(roleprocessedRol  if (> {
    nc (role) =le = asyocessRo  const pr
  Set();ew dRoles = ncessest pro
    cong inherited)dinnclu(iions ased permissAdd role-b 
    //   });
   
  ion}`);${perm.act}:m.resourceadd(`${perrmissions.
      pe=> {rm forEach(peons.issiPermctreuser.di    ermissions
irect p   // Add d);
    
  new Set(s =ssionnst permi
    co }
     Set();
   turn new{
      resActive) r.i|| !useer     if (!us;
    
issions')ectPermdirate('.popul      })
  
      }
      missions' }th: 'perte: { pa     popula,
     rentRoles'sions pah: 'permis   pat       
late: {popu   
      'roles',h:at    p
    pulate({po    .serId)
  dById(uait User.fin awst user =   
    con  }
 ons;
  hed.permissirn cac
      retumeout) {s.cacheTitamp < thihed.timesnow() - cace.&& Dat(cached   if     
  Key);
get(cacheche.missionCad = this.per const cacheId}`;
   sermissions:${u`user_pereKey =   const cachd) {
  ions(userIssUserPermi
  async gets
  }
  ute// 5 min0000; out = 30cacheTime;
    this. Map()he = newCacissionperm this.tor() {
   strucice {
  conss RBACServon
claplementatirvice ImRBAC Se;

// : true }
})defaultolean, type: BosActive: { 
  ipermissionserride , // Ovmission' }]er, ref: 'PjectIdpes.Ob.Tychemaoose.Smongype: : [{ termissions
  directP'Role' }],ectId, ref: Types.Objchema..Smongoosepe: roles: [{ ty
  ,: true }e, uniqueruquired: tng, re Striail: { type:  emchema({
 mongoose.Sema = new UserSchconst;


}) Date.now } default:e,Dat type: : {eatedAtcr  rue },
default: t, Booleane: { type: y
  isActivchrarhie Role le' }], //ef: 'RoObjectId, rypes..Toose.Schema mong: [{ type:Rolesnt
  pare }],ion': 'PermissefObjectId, res..Schema.Typgoosetype: mons: [{ mission
  perring,n: St descriptiorue },
 que: t: true, uniiredqu repe: String,e: { tyema({
  name.Schngoosmochema = new t RoleSons

cditions
});tional con  // Addi{} } t: aulct, deftype: Objeitions: { '
  condtete', 'dele, 'update', 'read'g., 'crea/ e.true },   /: uiredString, reqon: { type: t'
  acti', 'repororder., 'user', 'e }, // e.gred: trurequi, : Stringtypee: { resourc },
  ique: true unired: true,ring, requ{ type: Stme: 
  nase.Schema({w mongoone = hemarmissionScconst Pe

mongoose');= require(' mongoose constma Design
ase SchetabDacript
// avas**
```jxample

**Code Es:userroles to ng  assignito roles andsions inmisuping perby grool contrle access scalabs  provide
RBACnutes)** (3-5 mid Answertaileing.

**Deith cachecking w chsion permisicientand effcal roles,  hierarchies,titision enle-Permis-Ro Userdeslugn incsito users. De, roles ns to rolesermissio pignsassBAC conds)**
Rsewer (30  Ans

**Quick:** Commonuencyber | **FreqMicrosoft, Un, ** Amazoompanies:r | **C** SenioDifficulty:em
**stC) syol (RBAcess Contr Acased Role-BQ4: Design a
#### rol
 Contcessation & Acorizth### Au--



-henticationutc atriiomeication
- Bess authentPassword-lication
- hentctor autfa- Multi-**
ed Topics
**Relatportant?
t im why is iretching andword sthat is passely?
3. Wcrypt securashes to bisting MD5 hrate ex you migHow wouldg?
2. d hashinorssw56 for paSHA2er ovt preferred hy is bcryp Wns**
1.uestiow-up Qollo*Fryption

* encsiblerds in reverasswooring pmpts
- Stn atteg for logimitine linting ratNot implemes
- n functionsoafe comparing-unsm timi custoingImplementsalts
- ctable sing predi u orltg proper sausin- Not shing
ord hasswSHA1 for paing MD5 or *
- Ustakes***Common Misnetwork.

ds over the swornd pas never seol toocsword) protote Pas(Secure Rems SRP serd uy. 1Passwocuriter se for bettrgon2o Am bcrypt tted froropbox migra
Dld Context**
**Real-Wor
``
`
}
  }rn user; 
    retud);
   empts(user.inAtter.clearLogiwordManagass.pawait thislogin
    essful  on succled attemptsaiar f Cle  // }
    
    ntials');
 edeid crval('InErrorthrow new id);
      r.gin(usedLocordFaileanager.rewordMs.passawait thi
      sValid) {(!i
    if 
       );sword
 pas     user.assword, 
 
      pdArgon2(Passworer.verifyManagword.pass await thisd = isVali  constord
  swy pas   // Verif;
    
 pts(user.id)eminAtt.checkLognagerrdMas.passwo  await thi  g
mitinrate lik  // Chec
    
     }
  ntials');deInvalid cre new Error('  throwd');
    ormmy_passw'dun2(rdArgo.hashPasswoerswordManags.pas await thi
     ng attacksent timirevl hash to pion - stil enumeratrevent user // P
     er) {  if (!usl });
  One({ emaiUser.findait t user = awcons
    ) {assword p(email,eUsericatauthentnc asy
  
  }
  turn user;  
    re  });
  te()
  ew DaeatedAt: n    crssword,
  hashedPard: sswo pamail,
         e
  {te(User.crea= await st user on
    ctore user   // S  
 rd);
  won2(passdArgossworashPa.herrdManag this.passwoitrd = awasswo hashedPad
    constash passwor 
    // H
   
    }ments');recurity requit sees not meerd doworror('Pass throw new E {
     sValid)validation.if (!ord);
    isswdStrength(pasworlidatePasrdManager.va.passwohison = tnst validatico   trength
  sswordpasate Valid  // {
  sword) r(email, pasUseegistersync r }
  
  aager();
 swordManew SecurePas = nanageris.passwordM() {
    thstructor{
  conService tioncass Authentire
clan middlewatio authenticaage in Us
//}
}
rId}`);
  ts:${usemplogin_attel(`deait redis.    awrId) {
empts(usenAttearLogiclc 
  
  asyn
  }tempts;urn at 
    ret
    }
   ockoutes linut 15 m00); // 9ire(key,is.expit red awa   = 1) {
  empts ==(attf 
    ikey);
    incr(await redis.pts = ttemnst a coerId}`;
   :${usemptsgin_attkey = `lo   const d) {
 in(userILogdFailedecor rasync  
  
 true;
  }eturn    
    r;
    }
l} seconds`)n ${ttry again itempts. Tany login atoo mror(`Trow new Er);
      thdis.ttl(key reawait =   const ttl{
    >= 5) attempts f (  
    iy) || 0;
  (keedis.getwait rmpts = ateonst atId}`;
    cser${u_attempts:`loginkey = nst ) {
    coId(usermptsteoginAtsync checkL
  attemptsgin aiting for lo Rate lim//
  
  n };
  }hedToken, hastokeurn {    
    rethex');
   .digest('
    pdate(token)      .u)
256'ash('shacreateH      . = crypto
ashedToken    const hex');
ing('hes(32).toStrto.randomBytken = cryp to{
    constoken() ordResetTneratePasswsync geion
  antatmplemeword reset ipass  // Secure   

;
  }sword))st(pasttern.tetern => parns.some(patnPatteurn commoret      
];
  f/i
    abcde,
      /012345/ers
      /cteated chara2,}/, // Rep(.)\1{  /
    qwerty/i,,
      /ord/i    /passw
  6/,/12345       = [
monPatterns const com{
   word) s(passonPatterneckComm}
  
  ch  };
         }
ns
 tersNoCommonPat     ha
   pecialChar,  hasS    Numbers,
  as
        he, hasLowerCase,
       CashasUpper        th,
 >= minLengsword.lengthength: pas   minL      {
ts:requiremen     tterns,
 sNoCommonPa     ha          && 
Char asSpecial  h           & 
  bers &   hasNum        e && 
    owerCassL      ha   & 
      Case &sUpper     ha
          ength && th >= minLassword.lengalid: p      isVrn {

    retu);
    ordswerns(pasnPatt.checkCommo!thisPatterns = CommonNoconst has  
  rd);asswo/.test(p,.?":{}|<>]$%^&*()= /[!@#Char alt hasSpeci
    consword);test(pass /\d/.s =sNumber  const hasword);
  test(pas-z]/.ase = /[awerCLo   const hasword);
 est(passA-Z]/.tase = /[UpperCas   const h = 12;
 ngthst minLecond) {
    h(passworgtrenStatePasswordvalidion
  atalidtrength vord s
  // Passw  }
  e;
    }
turn fals    re
  r) {ch (erro  } catrd);
  swoash, pasy(hifargon2.verturn await       rery {
{
    td, hash) passwor2(rgonordAsw verifyPas  
  async    }
  }
ed');
ashing failsword hor('Pasew Errthrow n     ror) {
  catch (er    }      });
,
elism: 1parall
        timeCost: 3,       
 64 MB6, // ** 1: 2 Cost      memorygon2id,
  e: argon2.ar       typrd, {
 (passwo.hashon2wait argn a    retur   try {
  sword) {
 Argon2(pasPassword async hashrojects)
 ed for new pend(recommion entatrgon2 implem  
  // A    }
  }
se;
 falurn{
      ret (error) } catch;
    d, hash)wor(pass.compareit bcryptreturn awa {
      
    tryd, hash) {ypt(passworswordBcryPas async verif
  
 
    }
  };d')ileashing fa hor('Passwordrow new Err  th   ror) {
 catch (er;
    } ord, salt)t.hash(passwryprn await bc    retu
  ounds);s.bcryptRthinSalt(bcrypt.gealt = await const s {
      ry
    t{(password) swordBcrypthPas
  async hasntationimpleme// Bcrypt 
  
  
  }needsperformance security/st based on 2; // Adjuounds = 1his.bcryptR
    t) {r(tructonsger {
  coordManaswecurePasclass S

;re('crypto')to = requist cryp);
conrgon2're('an2 = requi argo
constcrypt');ire('bqu renst bcrypt =cript
co
```javasxample***Code E
*son:
ari compfe timing-saion, andlt generathms, saing algoriter hashires propndling requword haass
Secure p*s)*-5 minute (3d Answer**Detaile

rd policies.worong passe std enforccks, ang attatiminto prevent n omparisoent secure cmplemnds, irouroper salt shing with phaor password n2 f or Argo
Use bcrypt seconds)**er (30*Quick Answn

*mory Comcy:** Verequens | **F companie AllCompanies:**-Senior | **lty:** Midfficuion
**Didatd valiashing an hrdre passwocument se# Q3: Imple
###

---
icationhentteway autI Gaens
- APtokrer ea
- JWT BID Connect
- Openpics**lated To?

**Renicationmmurver cover-to-se0 for ser OAuth 2.mentyou imple. How would ients?
3ial OAuth clent confid andeen publicetwes b differenchat are theacks?
2. Wrception attnteon code irizatirevent autho does PKCE powns**
1. Hup Questioow-rs

**Follifieor code verion codes authorizat
- Reusing  validationeterstate paramr  propeimplementing Not t side
-ieny on clurelsecinfier ring code_ve Stori
-d be S256)hod (shoulmetllenge_chag code_alidatin- Not vakes**
 Mistmmon*Co

*s.lient secretng cut storihoPIs witbackend Ae with uthenticatsecurely aCE to  apps use PKe bankinglows. Mobiluth fr their OACE foent PKplemosoft all imcre, and Miglb, GooHu
Gitntext**Cod *Real-Worl``

* }
}
`   });
 _in: 3600
 es
      expirearer',ype: 'B_tentok  oken,
    refreshT_token:     refreshen,
  sToken: accesok access_tson({
        res.j   
 
 authData);n(eshTokeefreRrat.geneken = thisToreshref
    const Data);(authcessTokenenerateAcken = this.gt accessToonskens
    ce toratGene
    // 
       }nt' });
 nvalid_gra'i: son({ error00).jres.status(4 return  {
     _challenge)odeauthData.ce !== engdChalluteomp
    if (c  l');
    4urst('base6   .dige   verifier)
e(code_pdat
      .uha256')eateHash('scr   . crypto
   lenge =tedChalcompunst e
    coKCE challengerify P// V  
       }
 });
   alid_grant'rror: 'invjson({ e(400).uss.stat   return re
   ient_id) {= cl !=ta.client_idta || authDahDaif (!aute);
    AuthCode(codis.gett thata = awaiauthD   const a
  datationred authoriz stoverie/ Ret 
    /   .body;
id } = reqient_erifier, clode, code_v const { c
   , res) {geToken(reqnc exchan  
  asy
  }
ring());.toStrectUrledi.redirect(res
    rtate);
    tate', s'sset(arams.archPirectUrl.se  red);
  ode', authCs.set('coderamarchPatUrl.se
    redireci);t_urL(redirecUrl = new UR redirect  conston code
  zatihorith autwidirect  // Re;
    
   _uri
    })    redirectethod,
  enge_mde_chall   collenge,
   cha
      code_ent_id,
      clihCode, {e(autstoreAuthCodthis.
    await uthCode();enerateA this.gde =t authCo    consation code
 authorizenge with chall Store code //   
    
 }' });
   alid_client 'invr:json({ erros(400). res.statueturn     rient) {
 if (!cl
    rect_uri);d, redient_ilient(clidateChis.valit tt = awai const clien  
 irect URInd redient aate cl    // Validery;
    
 } = req.qu
       state ,
  edirect_uri
      rhod,methallenge_    code_cge, 
  de_challenco 
       client_id,   
     const {res) {
  (req, ionRequesthorizatalidateAut{
  async vuthServer KCEA Psstation
claver Implemenzation Serori

// Auth
  }
}.json();ponseeturn res
    r);
    
    }
      })eVerifierr: cod_verifie       coderi,
 directU: this.reriect_u  redir  Code,
      code: authtId,
      is.clienlient_id: th       c',
 de_cohorizatione: 'autrant_typ   g
     ({aramsRLSearchP: new U body  ed' },
   m-urlencodx-www-forapplication/t-Type': 'nten 'Co headers: {   POST',
   method: ', {
     uth/token'.com/oaoviderps://auth.prtch('httfe = await esponsenst r    co();
    
VerifiereveCode this.retrideVerifier =nst co co
   , state) {thCodeeForToken(auchangeCod
  async ex 
 );
  }String( authUrl.to    return());
    
terateStane.ge, thise'.set('statramsearchPaUrl.s;
    auth')56'S2ge_method', ode_challenrams.set('csearchPa  authUrl.lenge);
  halodeCenge', c'code_challet(.schParams.sear    authUrl;
d write')reaope', 's.set('scarchParamrl.sehUaut
    de');_type', 'coponseet('resParams.schl.searauthUrri);
    ctUs.redirect_uri', thidirereParams.set('thUrl.search);
    auientIdid', this.clent_set('clis.aramUrl.searchP
    authrize');hoth/aut.com/oauuth.providerps://ahttnew URL('authUrl = st    con  
 ier);
  r(codeVerifodeVerifieeC.store)
    thise storagcursession/serely (securifier e ve/ Stor  
    /;
  deVerifier)(coengeteCodeChall this.generage =allent codeCh    consrifier();
VenerateCode this.geifier =deVer const coh() {
   tiateAutsync ini a }
  
 ');
 t('base64urldiges)
      .iere(verif   .updat256')
   Hash('sha    .createto
  return crypr) {
    ifielenge(verteCodeChal  genera
  }
  
);ase64url'oString('b).t32ndomBytes(pto.ra  return cryer() {
  eVerifiteCod
  generahClient {EOAutclass PKCpress');

 require('express =);
const exo'yptuire('crrypto = reqnst cipt
cocr
```javasle**e Exampe

**Codengored chall) matches sterverificode_SHA256(verifies: rver . Seier`
6 `code_verifes originalcludhange inToken excde
5. tion co authorizaithenge wstores challtion server  Authorizahod`
4.nge_metle `code_chalenge` andchall`code_udes est inclqurization reuthoer))
3. A_verifi(SHA256(codeE64URL BASenge` =challe_reates `cod2. C)
racterscha(43-128 fier` code_veri random `nt generateslie. Cw:**
1lo Fs:

**PKCEient secretstore clly curet se cannoSPAs) thatbile apps,  (montsblic clieity for puth 2.0 securenhances OAu
PKCE tes)**inu(3-5 mr Answetailed .

**Deackson attrcepti inteization codeauthoring r, prevent paichallengede verifier/coenerating by gients or public cl layer fds securityExchange) ad for Code (Proof KeyKCE .0 with POAuth 2conds)**
(30 seuick Answer **Qmon

:** Comquency| **Fret, Meta osofGoogle, Micr** ompanies:**CSenior | ty:** *DifficulE
*KCtion with Pementauth 2.0 impl secure OA2: Design a

#### QSO)

--- (Sn-On Single Sigcation
-ntitor authe
- Multi-facect ConnOpenID.0 / OAuth 2
- s**opic T
**Related?
temuted sysdistribon in a JWT revocatile  hand do you. Howkies?
3oottpOnly c vs hlocalStorage in ring JWTns of stoimplicatioecurity  the s2. What areon?
token rotatiefresh ent JWT ru implemHow would yo1. tions**
p Queslow-ugs

**Folcurity flate cookie seropriaetting appt sem
- Nog thotatin not rorts ion secreng weak sessms
- Usih mechanisfresreroper token g pinntpleme
- Not imd)tecrypd, not enencode base64 ad (it'spaylota in JWT ensitive da
- Storing skes**mmon Mista

**Coaccess.ard for dashboessions tion but sthentica for API aus JWTpe uses. Striionpplicating web aser-facssions for u sebutnication vice commuvice-to-ser serorWT fx uses Jxt**
Netfli-World Conte``

**Real}
}));
`  our
// 1 he: 3600000 xAgon',
    mauctiod== 'prNV =.env.NODE_E: process
    secure{ cookie: 
   false,lized:ninitiasaveU  e,
ve: fals
  resaECRET,nv.SESSION_Ss.erocest: p secre
 Client }),is red client:re({Sto Redisore: new{
  ston(use(sessi
app.n);
io')(sessisnnect-redequire('coore = rRedisSt
const ');ioness'express-squire( ret session =onsion
centat Implemsion-based/ Ses  }
};

/en' });
alid toknv({ error: 'Ison1).j.status(40eturn res
    rh (error) { } catc  next();
 ded;
  ecoreq.user = dET);
    v.JWT_SECR.enprocessn, ke(to jwt.verifydecoded =onst     c
  try {
 ')[1];
  it('pl.sthorization?ders.aueaq.hen = reconst tok{
  next) => , res, (reqrifyToken = t veeware
considdlJWT Merify  V

//
}; }
  );resIn: '1h' expiET,
    {.JWT_SECRss.envce    pro  },
oles 
  oles: user.r     remail,
 er.ail: us      emer.id, 
Id: usser   u   { 
   (
 t.signurn jw
  ret {= (user) =>teToken st generaate JWT
con

// Generoken');ebtsonwire('jt jwt = requn
constatiomen// JWT Implecript
`javase**
``Code Examplems

**ibuted systin distrage ed stor or sharssionsticky se Requires slidation
-ver-side va: Serationserve opfor sensitiBetter sent
- ID ion Only sessad: client paylomaller sions
- Sfy ses/modivoketo rel: Easy roalized cont
- Centrtabase)dais, n store (Redsiontains sesai merver: SStatefuln:**
- atiouthenticbased Assion-

**Seionpirattil exs valid unevoke: Tokender to rons
- Harsind permiser claims a Includes usained:elf-contomains
- Ses/diple servicross multorks ac Walable:red
- Scage requitorver-side sndly: No serributed-frieen
- Distin toko encoded user inf: All - Statelesstion:**
Authentica*JWT ds:

*neeitectural archdifferent n serve catio authentission-based and seTokens)Web (JSON 
JWT s)**uteer (3-5 mined Answtail**Deture.

rchitecized aral centithapps wtional web er for tradiettrage bside stol server-re statefuns a; sessioted systemsdistribu good for uthoken-based aateless t is sts)**
JWTr (30 secondwens A*Quick Common

*ry* Vency:**FrequeStripe | *zon,  Ama Google,ompanies:** **CMid-Senior |culty:** ffiach
**Di to use en and whenatiohenticd aut-baseT vs Sessionain JW: Expl

#### Q1entManagemtity ion & IdenAuthenticat)

### tions30+ Quesuestions ( Q InterviewSecurity
## 
ce.

---d performananility stem reliabsyure o ensng talerties, and  logs, tracs,rough metricility thional visibvides operatng pros. Monitorie frameworkompliancn, and c encryptiotion, authorizaication,ough authenthrsystems t protecting focuses onecurity DR
S# TL; noise

##overage andetween cBalance bFatigue**: g  **Alertin
-oservicesacross micrt flow : Reques**acingTrd *Distributeration
- *nd saturs, araffic, errocy, t Latenn Signals**: **Goldeeements
-nd agrectives, aobjicators, l indrvice leveO/SLA**: Se **SLI/SL
-s, and traceogs ltrics,**: Meglerianvability TObsercepts
- **ng Coney Monitorie

### K architectur systemity intosecuruilding *: B Design* by**Securitystems
-  users/syghts forcess riMinimal acege**: ast Privilof Le**Principle ols
- controf security  layers MultipleDepth**: ense in l
- **Defrity moderify secuys vet, alwaNever trusitecture**: rchro Trust At
- **Ze managemenpermissioncation vs erifi: Identity vzation**ri Authoation vsAuthenticcepts
- **urity Con
### Key Secs.
nd roleior backel for seniaworks essentamempliance frs, and cocticeraility pservaboring, obance monitrmerfoes, pgition stratencryperns, etion patt/authorizationticavers authenuide coensive gcompreh. This visibilityerational tion, and opotecta pry, dagritm intee systehat ensur tngineeringof backend eal aspects e criticng arnitorimoity and Securummary
 Executive S##es)

#utd (10-15 mineak R## Quics

iew Questiong Intervorinrity & Monit
# Secu

---ommon": "very-c
frequencyer"]ripe", "UbStflix", " "Net", "Meta",crosoftMi"Amazon", e", "ooglies: ["G
companliance"] "compty",livabi, "obserion"", "encryptorization "authcation",ntithe, "auing"onitorty", "muri"sec: [10"
tags-01-d: "2025tUpdatet: 52
lasquestionCoun
ReadTime: 60stimatedced"
e: "advan
difficultyive""comprehensy: 
subcategorng"onitoriy-m "securitcategory:ns"
view Questioring Interity & Monitocure: "Se
titl---
-
--

## Security Interview Questions (30+ Questions)

### Authentication & Identity Management

#### Q1: Explain JWT vs Session-based authentication and when to use each
**Difficulty:** Mid-Senior | **Companies:** Google, Amazon, Stripe | **Frequency:** Very Common

**Quick Answer (30 seconds)**
JWT is stateless token-based auth good for distributed systems; sessions are stateful server-side storage better for traditional web apps with centralized architecture.

**Detailed Answer (3-5 minutes)**
JWT (JSON Web Tokens) and session-based authentication serve different architectural needs:

**JWT Authentication:**
- Stateless: All user info encoded in token
- Distributed-friendly: No server-side storage required
- Scalable: Works across multiple services/domains
- Self-contained: Includes user claims and permissions
- Harder to revoke: Tokens valid until expiration

**Session-based Authentication:**
- Stateful: Server maintains session store (Redis, database)
- Centralized control: Easy to revoke/modify sessions
- Smaller client payload: Only session ID sent
- Better for sensitive operations: Server-side validation
- Requires sticky sessions or shared storage in distributed systems

**Code Example**
```javascript
// JWT Implementation
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      roles: user.roles 
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Verify JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Session-based Implementation
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000 // 1 hour
  }
}));
```

**Real-World Context**
Netflix uses JWT for service-to-service communication but sessions for user-facing web applications. Stripe uses JWT for API authentication but sessions for dashboard access.

**Common Mistakes**
- Storing sensitive data in JWT payload (it's base64 encoded, not encrypted)
- Not implementing proper token refresh mechanisms
- Using weak session secrets or not rotating them
- Not setting appropriate cookie security flags

**Follow-up Questions**
1. How would you implement JWT refresh token rotation?
2. What are the security implications of storing JWT in localStorage vs httpOnly cookies?
3. How do you handle JWT revocation in a distributed system?

**Related Topics**
- OAuth 2.0 / OpenID Connect
- Multi-factor authentication
- Single Sign-On (SSO)

---

#### Q2: Design a secure OAuth 2.0 implementation with PKCE
**Difficulty:** Senior | **Companies:** Google, Microsoft, Meta | **Frequency:** Common

**Quick Answer (30 seconds)**
OAuth 2.0 with PKCE (Proof Key for Code Exchange) adds security layer for public clients by generating code verifier/challenge pair, preventing authorization code interception attacks.

**Detailed Answer (3-5 minutes)**
PKCE enhances OAuth 2.0 security for public clients (mobile apps, SPAs) that cannot securely store client secrets:

**PKCE Flow:**
1. Client generates random `code_verifier` (43-128 characters)
2. Creates `code_challenge` = BASE64URL(SHA256(code_verifier))
3. Authorization request includes `code_challenge` and `code_challenge_method`
4. Authorization server stores challenge with authorization code
5. Token exchange includes original `code_verifier`
6. Server verifies: SHA256(code_verifier) matches stored challenge

**Code Example**
```javascript
const crypto = require('crypto');

class PKCEOAuthClient {
  generateCodeVerifier() {
    return crypto.randomBytes(32).toString('base64url');
  }
  
  generateCodeChallenge(verifier) {
    return crypto
      .createHash('sha256')
      .update(verifier)
      .digest('base64url');
  }
  
  async initiateAuth() {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);
    
    // Store verifier securely (session/secure storage)
    this.storeCodeVerifier(codeVerifier);
    
    const authUrl = new URL('https://auth.provider.com/oauth/authorize');
    authUrl.searchParams.set('client_id', this.clientId);
    authUrl.searchParams.set('redirect_uri', this.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'read write');
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    authUrl.searchParams.set('state', this.generateState());
    
    return authUrl.toString();
  }
  
  async exchangeCodeForToken(authCode, state) {
    const codeVerifier = this.retrieveCodeVerifier();
    
    const response = await fetch('https://auth.provider.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        code: authCode,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier
      })
    });
    
    return response.json();
  }
}
```

**Real-World Context**
GitHub, Google, and Microsoft all implement PKCE for their OAuth flows. Mobile banking apps use PKCE to securely authenticate with backend APIs without storing client secrets.

**Common Mistakes**
- Not validating code_challenge_method (should be S256)
- Storing code_verifier insecurely on client side
- Not implementing proper state parameter validation
- Reusing authorization codes or code verifiers

**Follow-up Questions**
1. How does PKCE prevent authorization code interception attacks?
2. What are the differences between public and confidential OAuth clients?
3. How would you implement OAuth 2.0 for server-to-server communication?

**Related Topics**
- OpenID Connect
- JWT Bearer tokens
- API Gateway authentication

---

#### Q3: Implement secure password hashing and validation
**Difficulty:** Mid-Senior | **Companies:** All companies | **Frequency:** Very Common

**Quick Answer (30 seconds)**
Use bcrypt or Argon2 for password hashing with proper salt rounds, implement secure comparison to prevent timing attacks, and enforce strong password policies.

**Detailed Answer (3-5 minutes)**
Secure password handling requires proper hashing algorithms, salt generation, and timing-safe comparison:

**Code Example**
```javascript
const bcrypt = require('bcrypt');
const argon2 = require('argon2');
const crypto = require('crypto');

class SecurePasswordManager {
  constructor() {
    this.bcryptRounds = 12; // Adjust based on security/performance needs
  }
  
  // Bcrypt implementation
  async hashPasswordBcrypt(password) {
    try {
      const salt = await bcrypt.genSalt(this.bcryptRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error('Password hashing failed');
    }
  }
  
  async verifyPasswordBcrypt(password, hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      return false;
    }
  }
  
  // Argon2 implementation (recommended for new projects)
  async hashPasswordArgon2(password) {
    try {
      return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // 64 MB
        timeCost: 3,
        parallelism: 1,
      });
    } catch (error) {
      throw new Error('Password hashing failed');
    }
  }
  
  async verifyPasswordArgon2(password, hash) {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      return false;
    }
  }
  
  // Password strength validation
  validatePasswordStrength(password) {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNoCommonPatterns = !this.checkCommonPatterns(password);
    
    return {
      isValid: password.length >= minLength && 
               hasUpperCase && 
               hasLowerCase && 
               hasNumbers && 
               hasSpecialChar && 
               hasNoCommonPatterns,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
        hasNoCommonPatterns
      }
    };
  }
  
  checkCommonPatterns(password) {
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /(.)\1{2,}/, // Repeated characters
      /012345/,
      /abcdef/i
    ];
    
    return commonPatterns.some(pattern => pattern.test(password));
  }
  
  // Rate limiting for login attempts
  async checkLoginAttempts(userId) {
    const key = `login_attempts:${userId}`;
    const attempts = await redis.get(key) || 0;
    
    if (attempts >= 5) {
      const ttl = await redis.ttl(key);
      throw new Error(`Too many login attempts. Try again in ${ttl} seconds`);
    }
    
    return true;
  }
  
  async recordFailedLogin(userId) {
    const key = `login_attempts:${userId}`;
    const attempts = await redis.incr(key);
    
    if (attempts === 1) {
      await redis.expire(key, 900); // 15 minutes lockout
    }
    
    return attempts;
  }
}
```

**Real-World Context**
Dropbox migrated from bcrypt to Argon2 for better security. 1Password uses SRP (Secure Remote Password) protocol to never send passwords over the network.

**Common Mistakes**
- Using MD5 or SHA1 for password hashing
- Not using proper salt or using predictable salts
- Implementing custom timing-unsafe comparison functions
- Not implementing rate limiting for login attempts
- Storing passwords in reversible encryption

**Follow-up Questions**
1. Why is bcrypt preferred over SHA256 for password hashing?
2. How would you migrate existing MD5 hashes to bcrypt securely?
3. What is password stretching and why is it important?

**Related Topics**
- Multi-factor authentication
- Password-less authentication
- Biometric authentication

---

### Authorization & Access Control

#### Q4: Design a Role-Based Access Control (RBAC) system
**Difficulty:** Senior | **Companies:** Amazon, Microsoft, Uber | **Frequency:** Common

**Quick Answer (30 seconds)**
RBAC assigns permissions to roles, roles to users. Design includes User-Role-Permission entities, hierarchical roles, and efficient permission checking with caching.

**Detailed Answer (3-5 minutes)**
RBAC provides scalable access control by grouping permissions into roles and assigning roles to users:

**Code Example**
```javascript
// Database Schema Design
const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  resource: { type: String, required: true }, // e.g., 'user', 'order', 'report'
  action: { type: String, required: true },   // e.g., 'create', 'read', 'update', 'delete'
  conditions: { type: Object, default: {} }   // Additional conditions
});

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  parentRoles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }], // Role hierarchy
  isActive: { type: Boolean, default: true }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  directPermissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }], // Override permissions
  isActive: { type: Boolean, default: true }
});

// RBAC Service Implementation
class RBACService {
  constructor() {
    this.permissionCache = new Map();
    this.cacheTimeout = 300000; // 5 minutes
  }
  
  async getUserPermissions(userId) {
    const cacheKey = `user_permissions:${userId}`;
    const cached = this.permissionCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.permissions;
    }
    
    const user = await User.findById(userId)
      .populate({
        path: 'roles',
        populate: {
          path: 'permissions parentRoles',
          populate: { path: 'permissions' }
        }
      })
      .populate('directPermissions');
    
    if (!user || !user.isActive) {
      return new Set();
    }
    
    const permissions = new Set();
    
    // Add direct permissions
    user.directPermissions.forEach(perm => {
      permissions.add(`${perm.resource}:${perm.action}`);
    });
    
    // Add role-based permissions (including inherited)
    const processedRoles = new Set();
    const processRole = async (role) => {
      if (processedRoles.has(role._id.toString()) || !role.isActive) {
        return;
      }
      
      processedRoles.add(role._id.toString());
      
      // Add role permissions
      role.permissions.forEach(perm => {
        permissions.add(`${perm.resource}:${perm.action}`);
      });
      
      // Process parent roles (inheritance)
      for (const parentRole of role.parentRoles) {
        await processRole(parentRole);
      }
    };
    
    for (const role of user.roles) {
      await processRole(role);
    }
    
    // Cache the result
    this.permissionCache.set(cacheKey, {
      permissions,
      timestamp: Date.now()
    });
    
    return permissions;
  }
  
  async hasPermission(userId, resource, action, context = {}) {
    const permissions = await this.getUserPermissions(userId);
    const permissionKey = `${resource}:${action}`;
    
    if (!permissions.has(permissionKey)) {
      return false;
    }
    
    // Check additional conditions if needed
    return await this.checkPermissionConditions(userId, resource, action, context);
  }
  
  // Middleware for Express.js
  requirePermission(resource, action) {
    return async (req, res, next) => {
      try {
        const userId = req.user.id;
        const hasAccess = await this.hasPermission(
          userId, 
          resource, 
          action, 
          req.context || {}
        );
        
        if (!hasAccess) {
          return res.status(403).json({ 
            error: 'Insufficient permissions',
            required: `${resource}:${action}`
          });
        }
        
        next();
      } catch (error) {
        res.status(500).json({ error: 'Authorization check failed' });
      }
    };
  }
}
```

**Real-World Context**
AWS IAM uses RBAC with policy-based permissions. Salesforce implements RBAC with profile-based access control and permission sets.

**Common Mistakes**
- Not implementing role hierarchy properly
- Caching permissions without invalidation strategy
- Not considering context-based permissions
- Overly complex permission structures
- Not auditing permission changes

**Follow-up Questions**
1. How would you implement Attribute-Based Access Control (ABAC)?
2. What are the trade-offs between RBAC and ACL (Access Control Lists)?
3. How do you handle permission inheritance in complex role hierarchies?

**Related Topics**
- Policy-based access control
- OAuth scopes
- API Gateway authorization

---

### Encryption & Data Protection

#### Q5: Implement end-to-end encryption for sensitive data
**Difficulty:** Senior | **Companies:** Signal, WhatsApp, Stripe | **Frequency:** Common

**Quick Answer (30 seconds)**
E2E encryption ensures only sender and receiver can decrypt data. Implement using public-key cryptography for key exchange and symmetric encryption for data, with proper key management.

**Detailed Answer (3-5 minutes)**
End-to-end encryption protects data in transit and at rest, ensuring only intended recipients can access plaintext:

**Code Example**
```javascript
const crypto = require('crypto');

class E2EEncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits
    this.ivLength = 16;  // 128 bits
    this.tagLength = 16; // 128 bits
  }
  
  // Generate RSA key pair for each user
  async generateKeyPair() {
    const { publicKey, privateKey } = await crypto.generateKeyPair('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
    
    return { publicKey, privateKey };
  }
  
  // Generate symmetric key for message encryption
  generateSymmetricKey() {
    return crypto.randomBytes(this.keyLength);
  }
  
  // Encrypt symmetric key with recipient's public key
  encryptKey(symmetricKey, publicKey) {
    return crypto.publicEncrypt({
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    }, symmetricKey);
  }
  
  // Decrypt symmetric key with private key
  decryptKey(encryptedKey, privateKey) {
    return crypto.privateDecrypt({
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    }, encryptedKey);
  }
  
  // Encrypt message with symmetric key
  encryptMessage(message, key) {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipher(this.algorithm, key, iv);
    
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }
  
  // Complete E2E encryption flow
  async encryptForRecipients(message, recipientPublicKeys) {
    // Generate symmetric key for this message
    const symmetricKey = this.generateSymmetricKey();
    
    // Encrypt message with symmetric key
    const encryptedMessage = this.encryptMessage(message, symmetricKey);
    
    // Encrypt symmetric key for each recipient
    const encryptedKeys = {};
    for (const [recipientId, publicKey] of Object.entries(recipientPublicKeys)) {
      encryptedKeys[recipientId] = this.encryptKey(symmetricKey, publicKey).toString('base64');
    }
    
    return {
      encryptedMessage,
      encryptedKeys,
      timestamp: Date.now()
    };
  }
}
```

**Real-World Context**
Signal Protocol uses Double Ratchet algorithm for forward secrecy. WhatsApp implements Signal Protocol for E2E encryption. ProtonMail uses PGP for email encryption.

**Common Mistakes**
- Storing private keys in plaintext
- Not implementing forward secrecy
- Using weak random number generation
- Not validating public key authenticity
- Implementing custom crypto instead of proven libraries

**Follow-up Questions**
1. How do you implement perfect forward secrecy?
2. What is the Double Ratchet algorithm and why is it important?
3. How do you handle key distribution and verification?

**Related Topics**
- Digital signatures
- Certificate authorities
- Key escrow systems

---## Perf
ormance Monitoring Questions (20+ Questions)

### Observability & Metrics

#### Q6: Design a comprehensive observability strategy for microservices
**Difficulty:** Senior | **Companies:** Netflix, Uber, Airbnb | **Frequency:** Very Common

**Quick Answer (30 seconds)**
Implement the three pillars: metrics (Prometheus), logs (ELK), and traces (Jaeger). Use correlation IDs, structured logging, and SLI/SLO monitoring with alerting.

**Detailed Answer (3-5 minutes)**
Comprehensive observability requires metrics, logs, and distributed tracing working together:

**Code Example**
```javascript
const express = require('express');
const prometheus = require('prom-client');
const winston = require('winston');
const opentelemetry = require('@opentelemetry/api');

// Metrics setup with Prometheus
class MetricsService {
  constructor() {
    this.register = new prometheus.Registry();
    prometheus.collectDefaultMetrics({ register: this.register });
    
    this.httpRequestDuration = new prometheus.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code', 'service'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
    });
    
    this.httpRequestTotal = new prometheus.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code', 'service']
    });
    
    this.businessMetrics = new prometheus.Counter({
      name: 'business_events_total',
      help: 'Total business events',
      labelNames: ['event_type', 'service', 'status']
    });
    
    this.register.registerMetric(this.httpRequestDuration);
    this.register.registerMetric(this.httpRequestTotal);
    this.register.registerMetric(this.businessMetrics);
  }
  
  metricsMiddleware() {
    return (req, res, next) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const labels = {
          method: req.method,
          route: req.route?.path || req.path,
          status_code: res.statusCode,
          service: process.env.SERVICE_NAME || 'unknown'
        };
        
        this.httpRequestDuration.observe(labels, duration);
        this.httpRequestTotal.inc(labels);
      });
      
      next();
    };
  }
  
  trackBusinessEvent(eventType, status = 'success') {
    this.businessMetrics.inc({
      event_type: eventType,
      service: process.env.SERVICE_NAME || 'unknown',
      status
    });
  }
}

// Structured logging setup
class LoggingService {
  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return JSON.stringify({
            timestamp,
            level,
            message,
            service: process.env.SERVICE_NAME || 'unknown',
            version: process.env.SERVICE_VERSION || 'unknown',
            correlationId: meta.correlationId,
            traceId: meta.traceId,
            spanId: meta.spanId,
            userId: meta.userId,
            ...meta
          });
        })
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error' 
        }),
        new winston.transports.File({ 
          filename: 'logs/combined.log' 
        })
      ]
    });
  }
  
  correlationMiddleware() {
    return (req, res, next) => {
      req.correlationId = req.headers['x-correlation-id'] || 
                         req.headers['x-request-id'] || 
                         this.generateCorrelationId();
      
      res.setHeader('x-correlation-id', req.correlationId);
      next();
    };
  }
  
  generateCorrelationId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  info(message, meta = {}) {
    this.logger.info(message, this.enrichMeta(meta));
  }
  
  error(message, error, meta = {}) {
    this.logger.error(message, this.enrichMeta({
      ...meta,
      error: error?.stack || error,
      errorMessage: error?.message
    }));
  }
  
  enrichMeta(meta) {
    const span = opentelemetry.trace.getActiveSpan();
    const traceId = span?.spanContext()?.traceId;
    const spanId = span?.spanContext()?.spanId;
    
    return {
      ...meta,
      traceId,
      spanId,
      hostname: require('os').hostname(),
      pid: process.pid
    };
  }
}

// Health check and SLI monitoring
class HealthService {
  constructor() {
    this.dependencies = new Map();
    this.healthChecks = new Map();
  }
  
  registerDependency(name, healthCheck) {
    this.dependencies.set(name, healthCheck);
  }
  
  async checkHealth() {
    const results = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: process.env.SERVICE_NAME || 'unknown',
      version: process.env.SERVICE_VERSION || 'unknown',
      checks: {}
    };
    
    // Check dependencies
    for (const [name, check] of this.dependencies) {
      try {
        const start = Date.now();
        await check();
        results.checks[name] = {
          status: 'healthy',
          responseTime: Date.now() - start
        };
      } catch (error) {
        results.checks[name] = {
          status: 'unhealthy',
          error: error.message
        };
        results.status = 'unhealthy';
      }
    }
    
    return results;
  }
}

// Complete observability setup
class ObservabilityService {
  constructor() {
    this.metrics = new MetricsService();
    this.logging = new LoggingService();
    this.health = new HealthService();
    
    this.setupHealthChecks();
  }
  
  setupHealthChecks() {
    // Database health check
    this.health.registerDependency('database', async () => {
      await db.ping();
    });
    
    // Redis health check
    this.health.registerDependency('redis', async () => {
      await redis.ping();
    });
    
    // External API health check
    this.health.registerDependency('external-api', async () => {
      const response = await fetch('https://api.external.com/health');
      if (!response.ok) throw new Error('External API unhealthy');
    });
  }
  
  setupMiddleware(app) {
    app.use(this.logging.correlationMiddleware());
    app.use(this.metrics.metricsMiddleware());
    
    app.use((req, res, next) => {
      this.logging.info('HTTP Request', {
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        correlationId: req.correlationId,
        userId: req.user?.id
      });
      next();
    });
  }
  
  setupEndpoints(app) {
    // Metrics endpoint for Prometheus
    app.get('/metrics', async (req, res) => {
      res.set('Content-Type', this.metrics.register.contentType);
      res.end(await this.metrics.register.metrics());
    });
    
    // Health check endpoint
    app.get('/health', async (req, res) => {
      const health = await this.health.checkHealth();
      const statusCode = health.status === 'healthy' ? 200 : 503;
      res.status(statusCode).json(health);
    });
  }
}
```

**Real-World Context**
Netflix uses custom observability stack with Atlas (metrics), Mantis (stream processing), and distributed tracing. Uber built Jaeger for distributed tracing across thousands of microservices.

**Common Mistakes**
- Not correlating metrics, logs, and traces
- Over-instrumenting and creating noise
- Not setting up proper alerting thresholds
- Ignoring cardinality explosion in metrics
- Not implementing sampling for high-volume traces

**Follow-up Questions**
1. How do you handle observability data at scale (sampling, aggregation)?
2. What are SLIs, SLOs, and error budgets?
3. How do you implement distributed tracing across different programming languages?

**Related Topics**
- Chaos engineering
- Site reliability engineering
- Performance testing

---

#### Q7: Implement application performance monitoring (APM) with custom metrics
**Difficulty:** Mid-Senior | **Companies:** Datadog, New Relic, Dynatrace | **Frequency:** Common

**Quick Answer (30 seconds)**
APM tracks application performance through custom metrics, error tracking, transaction tracing, and user experience monitoring. Implement using agents or custom instrumentation.

**Detailed Answer (3-5 minutes)**
APM provides deep insights into application performance, user experience, and business metrics:

**Code Example**
```javascript
const express = require('express');
const prometheus = require('prom-client');

class APMService {
  constructor() {
    this.register = new prometheus.Registry();
    
    // Performance metrics
    this.responseTime = new prometheus.Histogram({
      name: 'app_response_time_seconds',
      help: 'Application response time in seconds',
      labelNames: ['endpoint', 'method', 'status'],
      buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5]
    });
    
    this.throughput = new prometheus.Counter({
      name: 'app_requests_total',
      help: 'Total application requests',
      labelNames: ['endpoint', 'method', 'status']
    });
    
    this.errorRate = new prometheus.Counter({
      name: 'app_errors_total',
      help: 'Total application errors',
      labelNames: ['endpoint', 'method', 'error_type']
    });
    
    // Database metrics
    this.dbQueryDuration = new prometheus.Histogram({
      name: 'db_query_duration_seconds',
      help: 'Database query duration',
      labelNames: ['query_type', 'table', 'status'],
      buckets: [0.001, 0.01, 0.1, 0.5, 1, 2, 5]
    });
    
    this.dbConnectionPool = new prometheus.Gauge({
      name: 'db_connection_pool_size',
      help: 'Database connection pool size',
      labelNames: ['pool_name', 'status']
    });
    
    // Business metrics
    this.userSessions = new prometheus.Gauge({
      name: 'active_user_sessions',
      help: 'Number of active user sessions'
    });
    
    this.businessTransactions = new prometheus.Counter({
      name: 'business_transactions_total',
      help: 'Total business transactions',
      labelNames: ['transaction_type', 'status', 'user_tier']
    });
    
    // Register all metrics
    [this.responseTime, this.throughput, this.errorRate, 
     this.dbQueryDuration, this.dbConnectionPool, 
     this.userSessions, this.businessTransactions].forEach(metric => {
      this.register.registerMetric(metric);
    });
  }
  
  // Middleware for automatic instrumentation
  instrumentMiddleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      const endpoint = req.route?.path || req.path;
      
      // Track request start
      this.throughput.inc({
        endpoint,
        method: req.method,
        status: 'started'
      });
      
      res.on('finish', () => {
        const duration = (Date.now() - startTime) / 1000;
        const status = res.statusCode >= 400 ? 'error' : 'success';
        
        // Record response time
        this.responseTime.observe({
          endpoint,
          method: req.method,
          status: res.statusCode.toString()
        }, duration);
        
        // Record throughput
        this.throughput.inc({
          endpoint,
          method: req.method,
          status: res.statusCode.toString()
        });
        
        // Record errors
        if (res.statusCode >= 400) {
          this.errorRate.inc({
            endpoint,
            method: req.method,
            error_type: this.categorizeError(res.statusCode)
          });
        }
      });
      
      next();
    };
  }
  
  // Database query instrumentation
  instrumentDatabase(db) {
    const originalQuery = db.query;
    
    db.query = async (sql, params, options = {}) => {
      const startTime = Date.now();
      const queryType = this.extractQueryType(sql);
      const table = this.extractTableName(sql);
      
      try {
        const result = await originalQuery.call(db, sql, params, options);
        
        const duration = (Date.now() - startTime) / 1000;
        this.dbQueryDuration.observe({
          query_type: queryType,
          table,
          status: 'success'
        }, duration);
        
        return result;
      } catch (error) {
        const duration = (Date.now() - startTime) / 1000;
        this.dbQueryDuration.observe({
          query_type: queryType,
          table,
          status: 'error'
        }, duration);
        
        throw error;
      }
    };
  }
  
  // Business transaction tracking
  trackBusinessTransaction(type, status, userTier = 'standard') {
    this.businessTransactions.inc({
      transaction_type: type,
      status,
      user_tier: userTier
    });
  }
  
  // User session tracking
  updateActiveUsers(count) {
    this.userSessions.set(count);
  }
  
  // Connection pool monitoring
  updateConnectionPool(poolName, active, idle, total) {
    this.dbConnectionPool.set({ pool_name: poolName, status: 'active' }, active);
    this.dbConnectionPool.set({ pool_name: poolName, status: 'idle' }, idle);
    this.dbConnectionPool.set({ pool_name: poolName, status: 'total' }, total);
  }
  
  // Error categorization
  categorizeError(statusCode) {
    if (statusCode >= 400 && statusCode < 500) return 'client_error';
    if (statusCode >= 500) return 'server_error';
    return 'unknown';
  }
  
  // SQL query analysis
  extractQueryType(sql) {
    const normalized = sql.trim().toLowerCase();
    if (normalized.startsWith('select')) return 'select';
    if (normalized.startsWith('insert')) return 'insert';
    if (normalized.startsWith('update')) return 'update';
    if (normalized.startsWith('delete')) return 'delete';
    return 'other';
  }
  
  extractTableName(sql) {
    const match = sql.match(/(?:from|into|update|join)\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
    return match ? match[1] : 'unknown';
  }
  
  // Custom performance tracking
  async trackPerformance(name, operation, metadata = {}) {
    const startTime = Date.now();
    
    try {
      const result = await operation();
      const duration = (Date.now() - startTime) / 1000;
      
      // Create custom metric if it doesn't exist
      if (!this.customMetrics) {
        this.customMetrics = new prometheus.Histogram({
          name: 'custom_operation_duration_seconds',
          help: 'Custom operation duration',
          labelNames: ['operation_name', 'status', 'metadata'],
          buckets: [0.001, 0.01, 0.1, 0.5, 1, 2, 5]
        });
        this.register.registerMetric(this.customMetrics);
      }
      
      this.customMetrics.observe({
        operation_name: name,
        status: 'success',
        metadata: JSON.stringify(metadata)
      }, duration);
      
      return result;
    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;
      
      this.customMetrics.observe({
        operation_name: name,
        status: 'error',
        metadata: JSON.stringify(metadata)
      }, duration);
      
      throw error;
    }
  }
  
  // Get metrics for export
  async getMetrics() {
    return this.register.metrics();
  }
}

// Usage example
const app = express();
const apm = new APMService();

// Setup APM middleware
app.use(apm.instrumentMiddleware());

// Instrument database
apm.instrumentDatabase(db);

// Example route with custom tracking
app.post('/api/orders', async (req, res) => {
  try {
    const order = await apm.trackPerformance(
      'create_order',
      async () => {
        // Business logic
        const order = await createOrder(req.body);
        
        // Track business transaction
        apm.trackBusinessTransaction(
          'order_creation',
          'success',
          req.user.tier
        );
        
        return order;
      },
      { userId: req.user.id, orderType: req.body.type }
    );
    
    res.json(order);
  } catch (error) {
    apm.trackBusinessTransaction(
      'order_creation',
      'error',
      req.user.tier
    );
    
    res.status(500).json({ error: 'Order creation failed' });
  }
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', apm.register.contentType);
  res.end(await apm.getMetrics());
});

// Periodic connection pool monitoring
setInterval(() => {
  const poolStats = db.getPoolStats();
  apm.updateConnectionPool(
    'main_pool',
    poolStats.active,
    poolStats.idle,
    poolStats.total
  );
}, 30000); // Every 30 seconds
```

**Real-World Context**
Shopify uses custom APM to track checkout performance and conversion rates. Airbnb monitors booking funnel performance with custom business metrics.

**Common Mistakes**
- Not tracking business-relevant metrics
- Over-instrumenting low-value operations
- Not correlating performance with business outcomes
- Ignoring database and external service performance
- Not setting up proper alerting on performance degradation

**Follow-up Questions**
1. How do you identify performance bottlenecks in distributed systems?
2. What are the key metrics for measuring user experience?
3. How do you implement performance budgets and SLAs?

**Related Topics**
- Real user monitoring (RUM)
- Synthetic monitoring
- Performance budgets

---

### Incident Response & Alerting

#### Q8: Design an effective alerting strategy to minimize alert fatigue
**Difficulty:** Senior | **Companies:** PagerDuty, Datadog, Splunk | **Frequency:** Common

**Quick Answer (30 seconds)**
Implement tiered alerting with SLO-based alerts, intelligent grouping, escalation policies, and runbook automation. Focus on actionable alerts that require human intervention.

**Detailed Answer (3-5 minutes)**
Effective alerting balances comprehensive monitoring with actionable notifications:

**Code Example**
```javascript
const express = require('express');
const prometheus = require('prom-client');

class AlertingService {
  constructor() {
    this.alertRules = new Map();
    this.alertHistory = new Map();
    this.escalationPolicies = new Map();
    this.suppressionRules = new Map();
  }
  
  // Define alert rules with SLO-based thresholds
  defineAlertRule(name, config) {
    this.alertRules.set(name, {
      ...config,
      id: name,
      createdAt: Date.now(),
      enabled: true
    });
  }
  
  // SLO-based error rate alerting
  setupSLOAlerts() {
    // Critical: Error rate > 1% for 5 minutes
    this.defineAlertRule('high_error_rate_critical', {
      metric: 'http_requests_total',
      condition: 'error_rate > 0.01',
      duration: '5m',
      severity: 'critical',
      description: 'Error rate exceeds 1% - immediate attention required',
      runbook: 'https://runbooks.company.com/high-error-rate',
      escalation: 'immediate',
      channels: ['pagerduty', 'slack-critical'],
      suppressionWindow: 300000, // 5 minutes
      autoResolve: true
    });
    
    // Warning: Error rate > 0.5% for 10 minutes
    this.defineAlertRule('high_error_rate_warning', {
      metric: 'http_requests_total',
      condition: 'error_rate > 0.005',
      duration: '10m',
      severity: 'warning',
      description: 'Error rate elevated - monitor closely',
      runbook: 'https://runbooks.company.com/elevated-error-rate',
      escalation: 'standard',
      channels: ['slack-alerts'],
      suppressionWindow: 600000, // 10 minutes
      autoResolve: true
    });
    
    // Latency SLO: P95 > 500ms for 5 minutes
    this.defineAlertRule('high_latency_slo', {
      metric: 'http_request_duration_seconds',
      condition: 'p95 > 0.5',
      duration: '5m',
      severity: 'warning',
      description: 'P95 latency exceeds SLO threshold',
      runbook: 'https://runbooks.company.com/high-latency',
      escalation: 'standard',
      channels: ['slack-alerts'],
      suppressionWindow: 300000
    });
    
    // Availability SLO: Success rate < 99.9% for 5 minutes
    this.defineAlertRule('availability_slo_breach', {
      metric: 'http_requests_total',
      condition: 'success_rate < 0.999',
      duration: '5m',
      severity: 'critical',
      description: 'Availability SLO breach - success rate below 99.9%',
      runbook: 'https://runbooks.company.com/availability-slo',
      escalation: 'immediate',
      channels: ['pagerduty', 'slack-critical']
    });
  }
  
  // Infrastructure alerting
  setupInfrastructureAlerts() {
    this.defineAlertRule('high_cpu_usage', {
      metric: 'cpu_usage_percent',
      condition: 'avg > 80',
      duration: '10m',
      severity: 'warning',
      description: 'High CPU usage detected',
      runbook: 'https://runbooks.company.com/high-cpu',
      escalation: 'standard',
      channels: ['slack-infra']
    });
    
    this.defineAlertRule('high_memory_usage', {
      metric: 'memory_usage_percent',
      condition: 'avg > 85',
      duration: '5m',
      severity: 'critical',
      description: 'Memory usage critically high',
      runbook: 'https://runbooks.company.com/high-memory',
      escalation: 'immediate',
      channels: ['pagerduty', 'slack-infra']
    });
    
    this.defineAlertRule('disk_space_low', {
      metric: 'disk_usage_percent',
      condition: 'max > 90',
      duration: '1m',
      severity: 'critical',
      description: 'Disk space critically low',
      runbook: 'https://runbooks.company.com/disk-space',
      escalation: 'immediate',
      channels: ['pagerduty', 'slack-infra']
    });
  }
  
  // Business metric alerting
  setupBusinessAlerts() {
    this.defineAlertRule('revenue_drop', {
      metric: 'revenue_per_minute',
      condition: 'current < (avg_over_time(7d) * 0.7)',
      duration: '15m',
      severity: 'critical',
      description: 'Revenue dropped 30% below 7-day average',
      runbook: 'https://runbooks.company.com/revenue-drop',
      escalation: 'business_critical',
      channels: ['pagerduty', 'slack-business', 'email-executives']
    });
    
    this.defineAlertRule('conversion_rate_drop', {
      metric: 'conversion_rate',
      condition: 'current < (avg_over_time(24h) * 0.8)',
      duration: '30m',
      severity: 'warning',
      description: 'Conversion rate dropped 20% below 24h average',
      runbook: 'https://runbooks.company.com/conversion-drop',
      escalation: 'standard',
      channels: ['slack-business']
    });
  }
  
  // Alert grouping and correlation
  groupAlerts(alerts) {
    const groups = new Map();
    
    alerts.forEach(alert => {
      // Group by service and time window
      const groupKey = `${alert.service}_${Math.floor(alert.timestamp / 300000)}`; // 5-minute windows
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          service: alert.service,
          alerts: [],
          firstSeen: alert.timestamp,
          lastSeen: alert.timestamp,
          severity: alert.severity
        });
      }
      
      const group = groups.get(groupKey);
      group.alerts.push(alert);
      group.lastSeen = Math.max(group.lastSeen, alert.timestamp);
      
      // Escalate group severity if needed
      if (this.getSeverityLevel(alert.severity) > this.getSeverityLevel(group.severity)) {
        group.severity = alert.severity;
      }
    });
    
    return Array.from(groups.values());
  }
  
  // Intelligent alert suppression
  shouldSuppressAlert(alertName, currentTime) {
    const lastAlert = this.alertHistory.get(alertName);
    if (!lastAlert) return false;
    
    const rule = this.alertRules.get(alertName);
    if (!rule) return false;
    
    // Check suppression window
    if (currentTime - lastAlert.timestamp < rule.suppressionWindow) {
      return true;
    }
    
    // Check for maintenance windows
    if (this.isInMaintenanceWindow(currentTime)) {
      return true;
    }
    
    // Check for related alert suppression
    return this.hasRelatedActiveAlerts(alertName);
  }
  
  // Escalation policies
  setupEscalationPolicies() {
    this.escalationPolicies.set('immediate', {
      steps: [
        { delay: 0, targets: ['oncall-primary'] },
        { delay: 300000, targets: ['oncall-secondary'] }, // 5 minutes
        { delay: 900000, targets: ['oncall-manager'] }    // 15 minutes
      ]
    });
    
    this.escalationPolicies.set('standard', {
      steps: [
        { delay: 0, targets: ['slack-alerts'] },
        { delay: 600000, targets: ['oncall-primary'] },   // 10 minutes
        { delay: 1800000, targets: ['oncall-secondary'] } // 30 minutes
      ]
    });
    
    this.escalationPolicies.set('business_critical', {
      steps: [
        { delay: 0, targets: ['oncall-primary', 'business-oncall'] },
        { delay: 180000, targets: ['oncall-manager', 'business-manager'] }, // 3 minutes
        { delay: 600000, targets: ['executive-team'] }                      // 10 minutes
      ]
    });
  }
  
  // Alert evaluation and firing
  async evaluateAlerts() {
    const currentTime = Date.now();
    const activeAlerts = [];
    
    for (const [name, rule] of this.alertRules) {
      if (!rule.enabled) continue;
      
      try {
        const shouldAlert = await this.evaluateCondition(rule);
        
        if (shouldAlert && !this.shouldSuppressAlert(name, currentTime)) {
          const alert = {
            id: `${name}_${currentTime}`,
            name,
            rule,
            timestamp: currentTime,
            severity: rule.severity,
            description: rule.description,
            runbook: rule.runbook,
            service: this.extractServiceFromMetric(rule.metric)
          };
          
          activeAlerts.push(alert);
          this.alertHistory.set(name, { timestamp: currentTime, alert });
          
          // Send alert through configured channels
          await this.sendAlert(alert);
        }
      } catch (error) {
        console.error(`Error evaluating alert rule ${name}:`, error);
      }
    }
    
    // Group related alerts
    const groupedAlerts = this.groupAlerts(activeAlerts);
    
    // Process escalations
    await this.processEscalations(groupedAlerts);
    
    return groupedAlerts;
  }
  
  // Send alert through configured channels
  async sendAlert(alert) {
    const rule = alert.rule;
    
    for (const channel of rule.channels) {
      try {
        switch (channel) {
          case 'pagerduty':
            await this.sendToPagerDuty(alert);
            break;
          case 'slack-critical':
          case 'slack-alerts':
          case 'slack-infra':
          case 'slack-business':
            await this.sendToSlack(alert, channel);
            break;
          case 'email-executives':
            await this.sendEmail(alert, 'executives');
            break;
        }
      } catch (error) {
        console.error(`Failed to send alert to ${channel}:`, error);
      }
    }
  }
  
  // Helper methods
  getSeverityLevel(severity) {
    const levels = { info: 1, warning: 2, critical: 3 };
    return levels[severity] || 0;
  }
  
  isInMaintenanceWindow(timestamp) {
    // Check if current time is within scheduled maintenance
    // Implementation depends on maintenance scheduling system
    return false;
  }
  
  hasRelatedActiveAlerts(alertName) {
    // Check if there are related alerts that should suppress this one
    // Implementation depends on alert correlation rules
    return false;
  }
  
  extractServiceFromMetric(metricName) {
    // Extract service name from metric name or labels
    return 'unknown-service';
  }
  
  async evaluateCondition(rule) {
    // Evaluate the alert condition against metrics
    // This would integrate with your metrics system (Prometheus, etc.)
    return false;
  }
  
  async sendToPagerDuty(alert) {
    // PagerDuty integration
    console.log(`Sending to PagerDuty: ${alert.description}`);
  }
  
  async sendToSlack(alert, channel) {
    // Slack integration
    console.log(`Sending to ${channel}: ${alert.description}`);
  }
  
  async sendEmail(alert, group) {
    // Email integration
    console.log(`Sending email to ${group}: ${alert.description}`);
  }
  
  async processEscalations(alertGroups) {
    // Process escalation policies for active alert groups
    for (const group of alertGroups) {
      // Implementation depends on escalation system
    }
  }
}

// Usage
const alerting = new AlertingService();
alerting.setupSLOAlerts();
alerting.setupInfrastructureAlerts();
alerting.setupBusinessAlerts();
alerting.setupEscalationPolicies();

// Run alert evaluation every minute
setInterval(() => {
  alerting.evaluateAlerts();
}, 60000);
```

**Real-World Context**
PagerDuty uses intelligent alert grouping to reduce noise by 90%. Google's SRE practices emphasize SLO-based alerting to focus on user-impacting issues.

**Common Mistakes**
- Alerting on symptoms instead of user impact
- Not implementing proper alert suppression
- Creating alerts without clear escalation paths
- Not providing actionable runbooks
- Alerting on metrics that don't require immediate action

**Follow-up Questions**
1. How do you balance alert coverage with alert fatigue?
2. What are the key principles of SLO-based alerting?
3. How do you implement intelligent alert correlation?

**Related Topics**
- SRE practices
- Incident management
- Runbook automation

---### Comp
liance & Incident Response

#### Q9: Design a SOC 2 Type II compliance monitoring system
**Difficulty:** Senior | **Companies:** Stripe, Snowflake, Okta | **Frequency:** Common

**Quick Answer (30 seconds)**
SOC 2 Type II requires continuous monitoring of security controls over time. Implement automated evidence collection, access logging, change management tracking, and regular compliance reporting.

**Detailed Answer (3-5 minutes)**
SOC 2 Type II compliance requires demonstrating effective operation of security controls over a period of time:

**Code Example**
```javascript
const express = require('express');
const crypto = require('crypto');

class SOC2ComplianceMonitor {
  constructor() {
    this.auditLogs = [];
    this.accessLogs = [];
    this.changeManagementLogs = [];
    this.securityIncidents = [];
    this.complianceReports = new Map();
  }
  
  // Security Control: Access Management (CC6.1)
  logUserAccess(userId, resource, action, result, ipAddress) {
    const accessLog = {
      timestamp: new Date().toISOString(),
      userId,
      resource,
      action,
      result, // 'granted' or 'denied'
      ipAddress,
      userAgent: this.getCurrentUserAgent(),
      sessionId: this.getCurrentSessionId(),
      riskScore: this.calculateRiskScore(userId, ipAddress, action)
    };
    
    this.accessLogs.push(accessLog);
    
    // Alert on suspicious access patterns
    if (accessLog.riskScore > 0.8) {
      this.triggerSecurityAlert('high_risk_access', accessLog);
    }
    
    // Store for compliance reporting
    this.storeComplianceEvidence('access_control', accessLog);
  }
  
  // Security Control: Change Management (CC8.1)
  logSystemChange(changeId, changeType, description, approver, implementer) {
    const changeLog = {
      timestamp: new Date().toISOString(),
      changeId,
      changeType, // 'code', 'infrastructure', 'configuration'
      description,
      approver,
      implementer,
      approvalTimestamp: this.getApprovalTimestamp(changeId),
      testingEvidence: this.getTestingEvidence(changeId),
      rollbackPlan: this.getRollbackPlan(changeId),
      businessJustification: this.getBusinessJustification(changeId)
    };
    
    this.changeManagementLogs.push(changeLog);
    
    // Validate change management process
    this.validateChangeProcess(changeLog);
    
    this.storeComplianceEvidence('change_management', changeLog);
  }
  
  // Security Control: Monitoring Activities (CC7.1)
  logSecurityEvent(eventType, severity, description, affectedSystems, responseActions) {
    const securityEvent = {
      timestamp: new Date().toISOString(),
      eventId: crypto.randomUUID(),
      eventType, // 'intrusion_attempt', 'data_access_violation', 'system_anomaly'
      severity, // 'low', 'medium', 'high', 'critical'
      description,
      affectedSystems,
      responseActions,
      detectionMethod: 'automated_monitoring',
      investigationStatus: 'open',
      assignedTo: this.getSecurityTeamMember(severity),
      escalationRequired: severity === 'critical'
    };
    
    this.securityIncidents.push(securityEvent);
    
    // Automatic escalation for critical events
    if (severity === 'critical') {
      this.escalateSecurityIncident(securityEvent);
    }
    
    this.storeComplianceEvidence('security_monitoring', securityEvent);
  }
  
  // Security Control: Data Protection (CC6.7)
  logDataAccess(userId, dataType, operation, recordCount, purpose) {
    const dataAccessLog = {
      timestamp: new Date().toISOString(),
      userId,
      dataType, // 'PII', 'financial', 'health', 'general'
      operation, // 'read', 'write', 'delete', 'export'
      recordCount,
      purpose, // 'business_operation', 'support', 'analytics'
      dataClassification: this.getDataClassification(dataType),
      encryptionStatus: this.getEncryptionStatus(dataType),
      retentionPolicy: this.getRetentionPolicy(dataType),
      legalBasis: this.getLegalBasis(dataType, purpose)
    };
    
    this.accessLogs.push(dataAccessLog);
    
    // Monitor for unusual data access patterns
    if (this.detectAnomalousDataAccess(dataAccessLog)) {
      this.triggerDataProtectionAlert(dataAccessLog);
    }
    
    this.storeComplianceEvidence('data_protection', dataAccessLog);
  }
  
  // Security Control: System Operations (CC8.1)
  logSystemPerformance() {
    const performanceMetrics = {
      timestamp: new Date().toISOString(),
      systemAvailability: this.calculateAvailability(),
      responseTime: this.getAverageResponseTime(),
      errorRate: this.getErrorRate(),
      securityPatchLevel: this.getSecurityPatchLevel(),
      backupStatus: this.getBackupStatus(),
      disasterRecoveryTest: this.getLastDRTestResult(),
      capacityUtilization: this.getCapacityUtilization()
    };
    
    // Check against SLA thresholds
    this.validateSLACompliance(performanceMetrics);
    
    this.storeComplianceEvidence('system_operations', performanceMetrics);
  }
  
  // Compliance Reporting
  generateComplianceReport(controlFamily, startDate, endDate) {
    const reportId = crypto.randomUUID();
    const evidence = this.getComplianceEvidence(controlFamily, startDate, endDate);
    
    const report = {
      reportId,
      controlFamily,
      reportingPeriod: { startDate, endDate },
      generatedAt: new Date().toISOString(),
      generatedBy: 'automated_compliance_system',
      evidence: evidence,
      controlEffectiveness: this.assessControlEffectiveness(evidence),
      exceptions: this.identifyExceptions(evidence),
      recommendations: this.generateRecommendations(evidence),
      nextReviewDate: this.calculateNextReviewDate()
    };
    
    this.complianceReports.set(reportId, report);
    
    // Notify compliance team
    this.notifyComplianceTeam(report);
    
    return report;
  }
  
  // Risk Assessment
  calculateRiskScore(userId, ipAddress, action) {
    let riskScore = 0;
    
    // Check for unusual access patterns
    if (this.isUnusualTimeAccess()) riskScore += 0.2;
    if (this.isUnusualLocationAccess(ipAddress)) riskScore += 0.3;
    if (this.isPrivilegedAction(action)) riskScore += 0.2;
    if (this.hasRecentFailedAttempts(userId)) riskScore += 0.3;
    
    return Math.min(riskScore, 1.0);
  }
  
  // Control Effectiveness Assessment
  assessControlEffectiveness(evidence) {
    const assessments = {
      access_control: this.assessAccessControlEffectiveness(evidence),
      change_management: this.assessChangeManagementEffectiveness(evidence),
      security_monitoring: this.assessSecurityMonitoringEffectiveness(evidence),
      data_protection: this.assessDataProtectionEffectiveness(evidence),
      system_operations: this.assessSystemOperationsEffectiveness(evidence)
    };
    
    return {
      overall: this.calculateOverallEffectiveness(assessments),
      individual: assessments,
      improvementAreas: this.identifyImprovementAreas(assessments)
    };
  }
  
  // Exception Handling
  identifyExceptions(evidence) {
    const exceptions = [];
    
    // Check for access control exceptions
    const unauthorizedAccess = evidence.filter(e => 
      e.type === 'access_control' && e.result === 'denied' && e.riskScore > 0.7
    );
    
    if (unauthorizedAccess.length > 0) {
      exceptions.push({
        type: 'unauthorized_access_attempts',
        count: unauthorizedAccess.length,
        severity: 'medium',
        description: 'Multiple high-risk access attempts detected'
      });
    }
    
    // Check for change management exceptions
    const unapprovedChanges = evidence.filter(e => 
      e.type === 'change_management' && !e.approver
    );
    
    if (unapprovedChanges.length > 0) {
      exceptions.push({
        type: 'unapproved_changes',
        count: unapprovedChanges.length,
        severity: 'high',
        description: 'Changes implemented without proper approval'
      });
    }
    
    return exceptions;
  }
  
  // Automated Evidence Collection
  storeComplianceEvidence(controlType, evidence) {
    const evidenceRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      controlType,
      evidence,
      hash: this.calculateEvidenceHash(evidence),
      retention: this.getRetentionPeriod(controlType),
      classification: 'compliance_evidence'
    };
    
    // Store in tamper-evident log
    this.auditLogs.push(evidenceRecord);
    
    // Archive to long-term storage
    this.archiveEvidence(evidenceRecord);
  }
  
  // Middleware for automatic compliance logging
  complianceMiddleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      
      // Log access attempt
      this.logUserAccess(
        req.user?.id || 'anonymous',
        req.path,
        req.method,
        'granted', // Will be updated based on response
        req.ip
      );
      
      res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        
        // Update access result based on response
        if (res.statusCode >= 400) {
          this.updateAccessResult(req.user?.id, req.path, 'denied');
        }
        
        // Log performance metrics
        if (responseTime > 5000) { // 5 second threshold
          this.logPerformanceIssue(req.path, responseTime);
        }
      });
      
      next();
    };
  }
  
  // Helper methods
  validateChangeProcess(changeLog) {
    const violations = [];
    
    if (!changeLog.approver) {
      violations.push('Missing change approver');
    }
    
    if (!changeLog.testingEvidence) {
      violations.push('Missing testing evidence');
    }
    
    if (!changeLog.rollbackPlan) {
      violations.push('Missing rollback plan');
    }
    
    if (violations.length > 0) {
      this.logComplianceViolation('change_management', violations, changeLog);
    }
  }
  
  calculateEvidenceHash(evidence) {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(evidence))
      .digest('hex');
  }
  
  // Additional helper methods would be implemented based on specific requirements
  getCurrentUserAgent() { return 'user-agent'; }
  getCurrentSessionId() { return 'session-id'; }
  getApprovalTimestamp(changeId) { return new Date().toISOString(); }
  getTestingEvidence(changeId) { return 'testing-evidence'; }
  getRollbackPlan(changeId) { return 'rollback-plan'; }
  getBusinessJustification(changeId) { return 'business-justification'; }
  getSecurityTeamMember(severity) { return 'security-team-member'; }
  escalateSecurityIncident(event) { console.log('Escalating:', event.eventId); }
  triggerSecurityAlert(type, data) { console.log('Security alert:', type); }
  triggerDataProtectionAlert(data) { console.log('Data protection alert'); }
  detectAnomalousDataAccess(log) { return false; }
  validateSLACompliance(metrics) { console.log('Validating SLA compliance'); }
  notifyComplianceTeam(report) { console.log('Notifying compliance team'); }
  archiveEvidence(evidence) { console.log('Archiving evidence'); }
}

// Usage
const app = express();
const complianceMonitor = new SOC2ComplianceMonitor();

// Setup compliance middleware
app.use(complianceMonitor.complianceMiddleware());

// Generate monthly compliance reports
setInterval(() => {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  
  complianceMonitor.generateComplianceReport('access_control', startDate, endDate);
  complianceMonitor.generateComplianceReport('change_management', startDate, endDate);
  complianceMonitor.generateComplianceReport('security_monitoring', startDate, endDate);
}, 30 * 24 * 60 * 60 * 1000); // Monthly
```

**Real-World Context**
Stripe maintains SOC 2 Type II compliance with automated evidence collection and continuous monitoring. Snowflake uses similar systems to demonstrate security control effectiveness to enterprise customers.

**Common Mistakes**
- Manual evidence collection instead of automated systems
- Not maintaining audit trails for all security-relevant events
- Insufficient documentation of control procedures
- Not regularly testing control effectiveness
- Inadequate incident response documentation

**Follow-up Questions**
1. How do you ensure audit trail integrity and tamper-evidence?
2. What are the key differences between SOC 2 Type I and Type II?
3. How do you automate compliance evidence collection at scale?

**Related Topics**
- GDPR compliance
- PCI DSS requirements
- ISO 27001 certification

---

#### Q10: Implement a comprehensive incident response system
**Difficulty:** Senior | **Companies:** All companies | **Frequency:** Very Common

**Quick Answer (30 seconds)**
Incident response requires automated detection, classification, escalation, communication, and post-incident analysis. Implement runbook automation, stakeholder notifications, and continuous improvement processes.

**Detailed Answer (3-5 minutes)**
Effective incident response minimizes impact through rapid detection, coordinated response, and systematic recovery:

**Code Example**
```javascript
const express = require('express');
const crypto = require('crypto');

class IncidentResponseSystem {
  constructor() {
    this.incidents = new Map();
    this.runbooks = new Map();
    this.escalationPolicies = new Map();
    this.communicationChannels = new Map();
    this.postMortems = new Map();
  }
  
  // Incident Detection and Creation
  createIncident(title, description, severity, source, metadata = {}) {
    const incidentId = `INC-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    
    const incident = {
      id: incidentId,
      title,
      description,
      severity, // P0 (critical), P1 (high), P2 (medium), P3 (low)
      status: 'open',
      source, // 'monitoring', 'user_report', 'manual'
      createdAt: new Date().toISOString(),
      createdBy: metadata.createdBy || 'system',
      assignedTo: null,
      affectedServices: metadata.affectedServices || [],
      customerImpact: this.assessCustomerImpact(severity, metadata.affectedServices),
      timeline: [{
        timestamp: new Date().toISOString(),
        action: 'incident_created',
        description: `Incident created: ${title}`,
        actor: metadata.createdBy || 'system'
      }],
      communications: [],
      actions: [],
      resolution: null,
      postMortemRequired: severity === 'P0' || severity === 'P1'
    };
    
    this.incidents.set(incidentId, incident);
    
    // Automatic assignment and escalation
    this.assignIncident(incidentId);
    this.initiateEscalation(incidentId);
    
    // Trigger automated response
    this.executeAutomatedResponse(incident);
    
    // Send initial notifications
    this.sendIncidentNotification(incident, 'created');
    
    return incident;
  }
  
  // Incident Assignment
  assignIncident(incidentId) {
    const incident = this.incidents.get(incidentId);
    if (!incident) return;
    
    // Determine assignee based on severity and affected services
    const assignee = this.determineAssignee(incident);
    
    incident.assignedTo = assignee;
    incident.timeline.push({
      timestamp: new Date().toISOString(),
      action: 'incident_assigned',
      description: `Incident assigned to ${assignee}`,
      actor: 'system'
    });
    
    // Notify assignee
    this.notifyAssignee(incident, assignee);
  }
  
  // Escalation Management
  initiateEscalation(incidentId) {
    const incident = this.incidents.get(incidentId);
    if (!incident) return;
    
    const escalationPolicy = this.escalationPolicies.get(incident.severity);
    if (!escalationPolicy) return;
    
    // Schedule escalation steps
    escalationPolicy.steps.forEach((step, index) => {
      setTimeout(() => {
        if (this.shouldEscalate(incidentId, step)) {
          this.escalateIncident(incidentId, step);
        }
      }, step.delay);
    });
  }
  
  escalateIncident(incidentId, escalationStep) {
    const incident = this.incidents.get(incidentId);
    if (!incident || incident.status === 'resolved') return;
    
    incident.timeline.push({
      timestamp: new Date().toISOString(),
      action: 'incident_escalated',
      description: `Incident escalated to ${escalationStep.level}`,
      actor: 'system'
    });
    
    // Notify escalation targets
    escalationStep.targets.forEach(target => {
      this.sendEscalationNotification(incident, target);
    });
    
    // Update incident priority if needed
    if (escalationStep.increasePriority) {
      this.increasePriority(incidentId);
    }
  }
  
  // Automated Response Actions
  executeAutomatedResponse(incident) {
    const runbook = this.getApplicableRunbook(incident);
    if (!runbook) return;
    
    runbook.automatedActions.forEach(async (action) => {
      try {
        const result = await this.executeAction(action, incident);
        
        incident.actions.push({
          timestamp: new Date().toISOString(),
          action: action.type,
          description: action.description,
          result: result.success ? 'success' : 'failed',
          details: result.details,
          automated: true
        });
        
        incident.timeline.push({
          timestamp: new Date().toISOString(),
          action: 'automated_action_executed',
          description: `Executed: ${action.description}`,
          actor: 'system'
        });
        
      } catch (error) {
        incident.actions.push({
          timestamp: new Date().toISOString(),
          action: action.type,
          description: action.description,
          result: 'error',
          details: error.message,
          automated: true
        });
      }
    });
  }
  
  // Communication Management
  sendIncidentNotification(incident, eventType) {
    const channels = this.getCommunicationChannels(incident.severity);
    
    const message = this.formatIncidentMessage(incident, eventType);
    
    channels.forEach(async (channel) => {
      try {
        await this.sendToChannel(channel, message, incident);
        
        incident.communications.push({
          timestamp: new Date().toISOString(),
          channel: channel.name,
          type: eventType,
          message: message.text,
          success: true
        });
      } catch (error) {
        incident.communications.push({
          timestamp: new Date().toISOString(),
          channel: channel.name,
          type: eventType,
          message: message.text,
          success: false,
          error: error.message
        });
      }
    });
  }
  
  // Status Updates
  updateIncidentStatus(incidentId, status, updateBy, notes) {
    const incident = this.incidents.get(incidentId);
    if (!incident) return;
    
    const previousStatus = incident.status;
    incident.status = status;
    
    incident.timeline.push({
      timestamp: new Date().toISOString(),
      action: 'status_updated',
      description: `Status changed from ${previousStatus} to ${status}`,
      actor: updateBy,
      notes
    });
    
    // Send status update notifications
    if (this.shouldNotifyStatusChange(previousStatus, status)) {
      this.sendIncidentNotification(incident, 'status_updated');
    }
    
    // Handle resolution
    if (status === 'resolved') {
      this.resolveIncident(incidentId, updateBy, notes);
    }
  }
  
  // Incident Resolution
  resolveIncident(incidentId, resolvedBy, resolution) {
    const incident = this.incidents.get(incidentId);
    if (!incident) return;
    
    incident.resolution = {
      timestamp: new Date().toISOString(),
      resolvedBy,
      description: resolution,
      duration: this.calculateIncidentDuration(incident),
      rootCause: null, // To be filled during post-mortem
      preventionMeasures: null
    };
    
    incident.timeline.push({
      timestamp: new Date().toISOString(),
      action: 'incident_resolved',
      description: `Incident resolved: ${resolution}`,
      actor: resolvedBy
    });
    
    // Send resolution notification
    this.sendIncidentNotification(incident, 'resolved');
    
    // Schedule post-mortem if required
    if (incident.postMortemRequired) {
      this.schedulePostMortem(incidentId);
    }
    
    // Update metrics
    this.updateIncidentMetrics(incident);
  }
  
  // Post-Mortem Management
  schedulePostMortem(incidentId) {
    const incident = this.incidents.get(incidentId);
    if (!incident) return;
    
    const postMortemId = `PM-${incidentId}`;
    const postMortem = {
      id: postMortemId,
      incidentId,
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours later
      facilitator: this.getPostMortemFacilitator(incident.severity),
      attendees: this.getPostMortemAttendees(incident),
      status: 'scheduled',
      timeline: this.generatePostMortemTimeline(incident),
      rootCauseAnalysis: null,
      actionItems: [],
      lessonsLearned: []
    };
    
    this.postMortems.set(postMortemId, postMortem);
    
    // Send post-mortem invitations
    this.sendPostMortemInvitations(postMortem);
  }
  
  // Runbook Management
  registerRunbook(name, config) {
    this.runbooks.set(name, {
      name,
      triggers: config.triggers, // Conditions that activate this runbook
      automatedActions: config.automatedActions || [],
      manualSteps: config.manualSteps || [],
      escalationCriteria: config.escalationCriteria || {},
      communicationTemplate: config.communicationTemplate || {},
      successCriteria: config.successCriteria || []
    });
  }
  
  // Setup common runbooks
  setupCommonRunbooks() {
    // High error rate runbook
    this.registerRunbook('high_error_rate', {
      triggers: [
        { metric: 'error_rate', condition: '> 0.05', duration: '5m' }
      ],
      automatedActions: [
        {
          type: 'scale_up',
          description: 'Scale up application instances',
          parameters: { instances: 2 }
        },
        {
          type: 'enable_circuit_breaker',
          description: 'Enable circuit breaker for external dependencies'
        }
      ],
      manualSteps: [
        'Check application logs for error patterns',
        'Verify database connectivity',
        'Review recent deployments',
        'Contact on-call engineer if issue persists'
      ]
    });
    
    // Database connectivity runbook
    this.registerRunbook('database_connectivity', {
      triggers: [
        { metric: 'db_connection_errors', condition: '> 10', duration: '2m' }
      ],
      automatedActions: [
        {
          type: 'restart_connection_pool',
          description: 'Restart database connection pool'
        },
        {
          type: 'failover_to_replica',
          description: 'Failover to read replica if available'
        }
      ],
      manualSteps: [
        'Check database server status',
        'Verify network connectivity',
        'Review database logs',
        'Contact DBA if needed'
      ]
    });
    
    // Security incident runbook
    this.registerRunbook('security_incident', {
      triggers: [
        { alert: 'suspicious_activity', severity: 'high' }
      ],
      automatedActions: [
        {
          type: 'isolate_affected_systems',
          description: 'Isolate potentially compromised systems'
        },
        {
          type: 'collect_forensic_data',
          description: 'Collect logs and system state for analysis'
        }
      ],
      manualSteps: [
        'Assess scope of potential breach',
        'Contact security team immediately',
        'Preserve evidence',
        'Consider customer notification requirements'
      ]
    });
  }
  
  // Setup escalation policies
  setupEscalationPolicies() {
    this.escalationPolicies.set('P0', {
      steps: [
        { delay: 0, level: 'primary_oncall', targets: ['oncall-primary'], increasePriority: false },
        { delay: 300000, level: 'secondary_oncall', targets: ['oncall-secondary'], increasePriority: false }, // 5 min
        { delay: 900000, level: 'management', targets: ['engineering-manager'], increasePriority: false }, // 15 min
        { delay: 1800000, level: 'executive', targets: ['cto', 'ceo'], increasePriority: false } // 30 min
      ]
    });
    
    this.escalationPolicies.set('P1', {
      steps: [
        { delay: 0, level: 'primary_oncall', targets: ['oncall-primary'], increasePriority: false },
        { delay: 900000, level: 'secondary_oncall', targets: ['oncall-secondary'], increasePriority: false }, // 15 min
        { delay: 3600000, level: 'management', targets: ['engineering-manager'], increasePriority: false } // 1 hour
      ]
    });
    
    this.escalationPolicies.set('P2', {
      steps: [
        { delay: 0, level: 'primary_oncall', targets: ['oncall-primary'], increasePriority: false },
        { delay: 3600000, level: 'secondary_oncall', targets: ['oncall-secondary'], increasePriority: false } // 1 hour
      ]
    });
  }
  
  // Metrics and Reporting
  updateIncidentMetrics(incident) {
    const metrics = {
      incidentId: incident.id,
      severity: incident.severity,
      duration: this.calculateIncidentDuration(incident),
      timeToDetection: this.calculateTimeToDetection(incident),
      timeToResolution: this.calculateTimeToResolution(incident),
      customerImpact: incident.customerImpact,
      affectedServices: incident.affectedServices.length,
      escalationCount: this.countEscalations(incident),
      automatedActionsCount: incident.actions.filter(a => a.automated).length,
      communicationsCount: incident.communications.length
    };
    
    // Store metrics for reporting and analysis
    this.storeIncidentMetrics(metrics);
  }
  
  // Helper methods
  assessCustomerImpact(severity, affectedServices) {
    // Logic to assess customer impact based on severity and affected services
    const impactLevels = {
      P0: 'high',
      P1: 'medium',
      P2: 'low',
      P3: 'minimal'
    };
    return impactLevels[severity] || 'unknown';
  }
  
  determineAssignee(incident) {
    // Logic to determine who should be assigned based on incident characteristics
    return 'oncall-primary';
  }
  
  getApplicableRunbook(incident) {
    // Find runbook that matches incident characteristics
    for (const [name, runbook] of this.runbooks) {
      if (this.matchesRunbookTriggers(incident, runbook.triggers)) {
        return runbook;
      }
    }
    return null;
  }
  
  async executeAction(action, incident) {
    // Execute automated action based on type
    switch (action.type) {
      case 'scale_up':
        return await this.scaleUpService(incident.affectedServices, action.parameters);
      case 'restart_connection_pool':
        return await this.restartConnectionPool();
      case 'enable_circuit_breaker':
        return await this.enableCircuitBreaker();
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }
  
  // Additional helper methods would be implemented based on specific requirements
  calculateIncidentDuration(incident) {
    if (!incident.resolution) return null;
    return new Date(incident.resolution.timestamp) - new Date(incident.createdAt);
  }
  
  shouldEscalate(incidentId, step) {
    const incident = this.incidents.get(incidentId);
    return incident && incident.status !== 'resolved';
  }
  
  formatIncidentMessage(incident, eventType) {
    return {
      text: `[${incident.severity}] ${incident.title}`,
      details: incident.description,
      status: incident.status,
      assignee: incident.assignedTo,
      link: `https://incidents.company.com/${incident.id}`
    };
  }
}

// Usage
const incidentResponse = new IncidentResponseSystem();
incidentResponse.setupCommonRunbooks();
incidentResponse.setupEscalationPolicies();

// Example: Create incident from monitoring alert
const incident = incidentResponse.createIncident(
  'High Error Rate Detected',
  'Error rate exceeded 5% threshold for user authentication service',
  'P1',
  'monitoring',
  {
    createdBy: 'monitoring_system',
    affectedServices: ['auth-service', 'user-service']
  }
);
```

**Real-World Context**
PagerDuty's incident response platform automates many of these processes. Google's SRE practices emphasize blameless post-mortems and systematic incident analysis.

**Common Mistakes**
- Not having clear escalation procedures
- Insufficient automation in incident response
- Poor communication during incidents
- Not conducting thorough post-mortems
- Failing to implement lessons learned from previous incidents

**Follow-up Questions**
1. How do you balance automation with human judgment in incident response?
2. What are the key components of an effective post-mortem process?
3. How do you measure and improve incident response effectiveness?

**Related Topics**
- Chaos engineering
- Disaster recovery planning
- Business continuity management

---

## Real-World Security Scenarios

### Scenario 1: Data Breach Response
**Situation:** Your e-commerce platform detects unauthorized access to customer payment data.

**Key Considerations:**
- Immediate containment and forensic preservation
- Customer notification requirements (GDPR, PCI DSS)
- Regulatory reporting obligations
- Business continuity during investigation
- Long-term security improvements

**Implementation Approach:**
```javascript
class DataBreachResponse {
  async handleDataBreach(breachDetails) {
    // 1. Immediate containment
    await this.containBreach(breachDetails);
    
    // 2. Assess scope and impact
    const assessment = await this.assessBreachScope(breachDetails);
    
    // 3. Notify stakeholders
    await this.notifyStakeholders(assessment);
    
    // 4. Regulatory compliance
    await this.handleRegulatoryRequirements(assessment);
    
    // 5. Customer communication
    await this.communicateWithCustomers(assessment);
    
    // 6. Forensic investigation
    await this.conductForensicInvestigation(breachDetails);
    
    // 7. Remediation and improvement
    await this.implementRemediation(assessment);
  }
}
```

### Scenario 2: DDoS Attack Mitigation
**Situation:** Your API is under a sophisticated DDoS attack affecting service availability.

**Key Considerations:**
- Traffic analysis and attack pattern identification
- Rate limiting and traffic shaping
- CDN and WAF configuration
- Upstream provider coordination
- Customer communication during outage

### Scenario 3: Insider Threat Detection
**Situation:** Unusual data access patterns suggest potential insider threat.

**Key Considerations:**
- Behavioral analytics and anomaly detection
- Legal and HR coordination
- Evidence preservation
- Minimal business disruption
- Employee privacy considerations

---

## Performance Bottleneck Scenarios

### Scenario 1: Database Performance Degradation
**Situation:** Application response times increase dramatically during peak hours.

**Investigation Approach:**
1. Query performance analysis
2. Connection pool monitoring
3. Index optimization assessment
4. Hardware resource utilization
5. Caching strategy evaluation

### Scenario 2: Memory Leak in Production
**Situation:** Node.js application memory usage continuously increases over time.

**Debugging Strategy:**
1. Heap dump analysis
2. Memory profiling in production
3. Garbage collection monitoring
4. Event listener leak detection
5. Gradual rollout of fixes

---

## Summary

Security and monitoring are foundational to building reliable, trustworthy systems. Key takeaways:

**Security Essentials:**
- Implement defense in depth with multiple security layers
- Use proven cryptographic libraries and protocols
- Design with security from the ground up
- Regularly audit and update security measures
- Maintain compliance with relevant standards

**Monitoring Best Practices:**
- Implement comprehensive observability (metrics, logs, traces)
- Focus on user-impacting alerts to reduce noise
- Automate incident response where possible
- Conduct thorough post-incident analysis
- Continuously improve based on lessons learned

**Integration Points:**
- Security monitoring feeds into incident response
- Compliance requirements drive monitoring strategies
- Performance issues can indicate security problems
- Incident response procedures must consider security implications

The intersection of security and monitoring creates a robust foundation for maintaining system reliability, protecting sensitive data, and ensuring regulatory compliance in production environments.