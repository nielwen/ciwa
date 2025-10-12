// CIWA-Ar
export const AR_LABELS = {
    ar1: { labels:[
    'Ikke kvalme og ikke oppkast',
    'Lett kvalme uten oppkast',
    '',
    '',
    'Periodisk kvalme med brekninger',
    '',
    '',
    'Vedvarende kvalme, hyppige brekninger og oppkast'
    ], max:7 },
    ar2: { labels:[
    'Ingen tremor',
    'Ikke synlig, men kan kjennes fingertupp mot fingertupp',
    '',
    '',
    'Moderat, med pasientens armer utstrakt',
    '',
    '',
    'Sterk, selv når armene ikke er utstrakt'
    ], max:7 },
    ar3: { labels:[
    'Ingen synlig svette',
    'Knapt merkbar svetting, klamme håndflater',
    '',
    '',
    'Tydelige svetteperler i pannen',
    '',
    '',
    'Gjennomvåt av svette'
    ], max:7 },
    ar4: { labels:[
    'Ingen angst, rolig',
    'Lett engstelig',
    '',
    '',
    'Moderat engstelig eller vaktsom (slik at det oppfattes som angst)',
    '',
    '',
    'Tilsvarende akutt panikktilstand som ved alvorlig delirium eller akutte schizofrene reaksjoner'
    ], max:7 },
    ar5: { labels:[
    'Normal aktivitet',
    'Noe mer enn normal aktivitet',
    '',
    '',
    'Moderat urolig og rastløs',
    '',
    '',
    'Vandrer frem og tilbake under mesteparten av intervjuet eller kaster på seg hele tiden'
    ], max:7 },
    ar6: { labels:[
    'Ingen',
    'Svært lett kløe, prikking, stikking, svie eller nummenhet',
    'Lett kløe, prikking, stikking, svie eller nummenhet',
    'Moderat kløe, prikking, stikking, svie eller nummenhet',
    'Moderate hallusinasjoner',
    'Sterke hallusinasjoner',
    'Svært sterke hallusinasjoner',
    'Vedvarende hallusinasjoner'
    ], max:7 },
    ar7: { labels:[
    'Ingen',
    'Svært lett ubehag eller evne til å skremme',
    'Lett ubehag eller evne til å skremme',
    'Moderat ubehag eller evne til å skremme',
    'Moderate hallusinasjoner',
    'Sterke hallusinasjoner',
    'Svært sterke hallusinasjoner',
    'Vedvarende hallusinasjoner'
    ], max:7 },
    ar8: { labels:[
    'Ingen',
    'Svært lett lysfølsomhet',
    'Lett lysfølsomhet',
    'Moderat lysfølsomhet',
    'Moderate hallusinasjoner',
    'Sterke hallusinasjoner',
    'Svært sterke hallusinasjoner',
    'Vedvarende hallusinasjoner'
    ], max:7 },
    ar9: { labels:[
    'Ingen',
    'Svært lett',
    'Lett',
    'Moderat',
    'Moderat sterk',
    'Sterkt',
    'Svært sterkt',
    'Ekstremt sterk'
    ], max:7 },
    ar10:{ labels:[
    'Orientert og kan legge sammen flere tall',
    'Kan ikke legge sammen flere tall eller er usikker på dato',
    'Ikke orientert for dato, avviker med inntil 2 dager',
    'Ikke orientert for dato, avviker med mer enn 2 dager',
    'Ikke orientert for sted og/eller person'
    ], max:4 }
};
export const CIWA_AR = [
    { key:'ar1', title:'Kvalme og oppkast', help:'Spør: «Føler du deg kvalm? Har du kastet opp?» Observasjon.', max:7 },
    { key:'ar2', title:'Tremor', help:'Armene utstrakt med spredte fingre. Observasjon.', max:7 },
    { key:'ar3', title:'Svettetokter', help:'Observasjon.', max:7 },
    { key:'ar4', title:'Angst', help:'Spør: «Føler du deg nervøs?» Observasjon.', max:7 },
    { key:'ar5', title:'Uro', help:'Observasjon.', max:7 },
    { key:'ar6', title:'Sensibilitetsforstyrrelser (taktile)', help:'Kløe, prikking, stikking, svie, nummenhet, småkryp. Spør: "Har du noe form for kløe, prikking, stikking, brennende/sviende følelse, nummenhet eller kjenner du at småkryp kravler på eller under huden din?" Observasjon.', max:7 },
    { key:'ar7', title:'Hørselsforstyrrelser', help:'Lyder, ubehag/skremmende, hallusinasjoner. Spør: "Er du mer oppmerksom på lyder rundt deg? Er de ubehagelige? Skremmer de deg? Hører du noe som er urovekkende? Hører du ting som du vet ikke er der?" Observasjon.', max:7 },
    { key:'ar8', title:'Synsforstyrrelser', help:'Lysfølsomhet, farger, smerte, hallusinasjoner. Spør: Virker lyset sterkere enn vanlig? Oppleves farger annerledes enn vanlig? Gjør det vondt for øynene? Ser du noe som er urovekkende? Ser du ting som du vet ikke er der? Observasjon.', max:7 },
    { key:'ar9', title:'Hodepine/trykk i hodet', help:'Ikke skår for svimmelhet/ørhet. Spør: "Føles hodet annerledes? Føles det som om det er et bånd rundt hodet ditt?"', max:7 },
    { key:'ar10', title:'Orientering og bevissthetsnivå', help:'Tid/sted/person, hoderegning. Spør: "Hvilken dag er det i dag? Hvor er du? Hvem er jeg?" og "Legg sammen følgende tall ..."', max:4 }
];