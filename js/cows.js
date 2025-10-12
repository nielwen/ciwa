// COWS
export const COWS_LABELS = {
    c1:{ title:'Hvilepuls', options:[
    {value:0,text:'≥80 per minutt'}, {value:1,text:'81–100'}, {value:2,text:'101–120'}, {value:4,text:'>120'}]},
    c2:{ title:'Tremor', help: 'Utstrakte hender. Se og kjenn på fingre', options:[
    {value:0,text:'Ingen tremor'}, {value:1,text:'Tremor kan føles, men ikke observeres'}, {value:2,text:'Tremor så vidt observerbar'}, {value:4,text:'Kraftig tremor eller muskelrykninger'}]},
    c3:{ title:'Gåsehud', help: 'Se og kjenn på underarmen', options:[
    {value:0,text:'Huden er glatt'}, {value:3,text:'Gåsehud er følbar eller observerbar på armene'}, {value:5,text:'Betydelig gåsehud'}]},
    c4:{ title:'Svette/frysninger siste 30 min', options:[
    {value:0,text:'Ingen svette eller frysninger'}, {value:1,text:'Pasienten oppgir svette/frysninger, men ikke observerbart'}, {value:2,text:'Observerbar rødme eller fuktighet i ansikt'}, {value:3,text:'Perler av svette i panne/ansikt'}, {value:4,text:'Svette renner nedover ansikt'}]},
    c5:{ title:'Rennende nese eller øyne (ikke forkjølelse/allergi)', options:[
    {value:0,text:'Ingen'}, {value:1,text:'Nesetetthet eller fuktige øyne'}, {value:2,text:'Rennende nese eller øyne'}, {value:4,text:'Kraftig rennende nese eller tårer strømmer nedover kinn'}]},
    c6:{ title:'Pupillestørrelse (moderat belyst rom)', options:[
    {value:0,text:'Ikke større enn normalt'}, {value:1,text:'Muligens noe større'}, {value:2,text:'Moderat dilatert'}, {value:5,text:'Så dilatert at bare randen av iris er synlig'}]},
    c7:{ title:'Gjesping', help: 'Observeres under konsultasjonen', options:[
    {value:0,text:'Ingen'}, {value:1,text:'1–2 ganger under konsultasjon'}, {value:2,text:'≥3 under konsultasjon'}, {value:4,text:'Flere ganger per minutt'}]},
    c8:{ title:'Angst eller irritabilitet', options:[
    {value:0,text:'Ingen'}, {value:1,text:'Oppgir økt angst/irritabilitet'}, {value:2,text:'Objektivt angstpreget eller irritabel'}, {value:4,text:'Så angstpreget/irritabel at vansker med samarbeid'}]},
    c9:{ title:'Rastløshet', options:[
    {value:0,text:'Ingen'}, {value:1,text:'Oppgir å ha vansker med å sitte stille, men klarer å sitte stille under konsultasjonen'}, {value:3,text:'Hyppig skifte av kroppstilling eller stadige bevegelser av armer og bein'}, {value:5,text:'Klarer ikke sitte stille mer enn noen få sekunder'}]},
    c10:{ title:'Muskel- eller leddplager (oppstått etter abstinensstart)', options:[
    {value:0,text:'Ingen'}, {value:1,text:'Mildt/diffust ubehag/kribling'}, {value:2,text:'Kraftig diffus smerte/kribling'}, {value:4,text:'Gnir seg mot ledd/muskler eller klarer ikke sitte stille'}]},
    c11:{ title:'Gastrointestinale plager siste 30 min', options:[
    {value:0,text:'Ingen'}, {value:1,text:'Magesmerter/-ubehag'}, {value:2,text:'Kvalme eller løs avføring'}, {value:3,text:'Oppkast eller diaré'}, {value:5,text:'Flere episoder med oppkast eller diaré'}]}
};

export const COWS = Object.keys(COWS_LABELS).map((k)=>{
    const o = COWS_LABELS[k];
    return { key:k, title:o.title, options:o.options, help: o.help };
});