// ========================================
// MADRS.JS - Montgomery–Åsberg Depression Rating Scale
// Definisjoner og labels for MADRS-spørsmål
// Basert på offisiell norsk versjon fra Legeforeningen
// ========================================

// MADRS spørsmålsliste
export const MADRS = [
  { key: 'q1', title: 'Synlig tristhet', help: 'Sikter på dysterhet, tungsinn, fortvilelse (mer enn bare vanlig forbigående dårlig humør), slik det avspeiler seg i tale, mimikk og holdning. Grader på grunnlag av dybde og manglende evne til å lysne opp.', max: 6 },
  { key: 'q2', title: 'Tristhet', help: 'Tar sikte på subjektivt opplevet sinnsstemning, uansett om stemningen gir seg ytre uttrykk eller ikke. Omfatter senket stemningsleie, tristhet, oppgitthet, tungsinn, håpløshet og hjelpeløshet. Grader i henhold til intensitet, varighet og i hvilken grad sinnsstemningen påvirkes av ytre omstendigheter. Oppstemthet skåres som 0.', max: 6 },
  { key: 'q3', title: 'Indre spenning', help: 'Sikter på følelse av vag ulystfølelse, ubehagelig indre spenning, uro, angst, stigende til panikk. Grader i henhold til intensitet, varighet og behov for hjelp og støtte. Skilles fra tristhet (2).', max: 6 },
  { key: 'q4', title: 'Redusert nattesøvn', help: 'Sikter på subjektiv opplevelse av kortvarig eller mindre dyp søvn sammenlignet med vanlig tilstand.', max: 6 },
  { key: 'q5', title: 'Svekket appetitt', help: 'Sikter på følelsen av at appetitten er svekket i forhold til tidligere.', max: 6 },
  { key: 'q6', title: 'Konsentrasjonsvansker', help: 'Sikter på vansker med å samle tankene, stigende til invalidiserende mangel på konsentrasjonsevne. Grader i henhold til intensitet, frekvens og grad av invalidiserende effekt.', max: 6 },
  { key: 'q7', title: 'Initiativløshet', help: 'Sikter på vanskelighet med å komme i gang, treghet med å ta initiativ og utføre dagligdagse aktiviteter.', max: 6 },
  { key: 'q8', title: 'Svekkede følelsesmessige reaksjoner', help: 'Sikter på den subjektive opplevelse av svekkede interesser for omgivelsene, eller for aktiviteter som normalt gir glede. Evnen til å reagere med adekvate følelser på omstendighetene eller andre mennesker er redusert. Skilles fra initiativløshet (7).', max: 6 },
  { key: 'q9', title: 'Depressivt tankeinnhold', help: 'Sikter på tanker om skyld, mindreverdighet, selvbebreidelser, anger og tanker om økonomisk ruin, etc.', max: 6 },
  { key: 'q10', title: 'Suicidaltanker', help: 'Tar sikte på følelsen av at livet ikke er verd å leve, at en naturlig død ville være velkommen, suicidale tanker, og forberedelse til selvmord.', max: 6 }
];

// MADRS labels for hvert spørsmål - basert på offisiell PDF
export const MADRS_LABELS = {
  q1: {
    labels: [
      'Ingen tristhet.',
      '',
      'Ser trist og humørløs ut, men kan leilighetsvis lysne opp.',
      '',
      'Virker trist og ulykkelig hele tiden.',
      '',
      'Ekstrem og vedvarende tristhet og fortvilelse.'
    ]
  },
  q2: {
    labels: [
      'Stort sett indifferent stemningsleie. Leilighetsvis tristhet når omstendighetene tilsier det.',
      '',
      'Overveiende følelse av nedstemthet, men lysere øyeblikk forekommer.',
      '',
      'Gjennomtrengende følelse av tristhet og dysterhet. Sinnsstemningen influeres knapt av ytre omstendigheter.',
      '',
      'Konstant opplevelse av sterk tristhet og fortvilelse.'
    ]
  },
  q3: {
    labels: [
      'Rolig, bare antydning til indre spenning.',
      '',
      'Leilighetsvis følelse av ubehagelig psykisk spenning og vag uro.',
      '',
      'Vedvarende følelse av indre spenning eller panikkepisoder som pasienten bare kan mestre med vanskelighet.',
      '',
      'Vedvarende frykt og angst. Overveldende panikkfølelse.'
    ]
  },
  q4: {
    labels: [
      'Sover som vanlig.',
      '',
      'Moderate innsovningsvansker eller moderat, redusert, lett eller urolig søvn.',
      '',
      'Søvnen redusert eller avbrutt med minst to timer sammenlignet med vanlig.',
      '',
      'Mindre enn to til tre timers søvn om natten.'
    ]
  },
  q5: {
    labels: [
      'Normal eller øket appetitt.',
      '',
      'Moderat redusert appetitt.',
      '',
      'Nesten ingen appetitt, maten smaker ikke, må tvinge seg selv til å spise.',
      '',
      'Næringsvegrende. Må overtales av andre til å spise.'
    ]
  },
  q6: {
    labels: [
      'Ingen konsentrasjonsvansker.',
      '',
      'Leilighetsvis vansker med å samle tankene.',
      '',
      'Vansker med konsentrasjon og vedvarende oppmerksomhet, som forstyrrer lesing eller konversasjon.',
      '',
      'Invalidiserende mangel på konsentrasjonsevne.'
    ]
  },
  q7: {
    labels: [
      'Ingen spesielle vansker med å komme i gang med ting, ingen treghet.',
      '',
      'Visse vansker med å komme i gang med aktiviteter.',
      '',
      'Vanskeligheter med å komme i gang med enkle rutineaktiviteter, som kan utføres bare med betydelig anstrengelse.',
      '',
      'Helt manglende evne til å ta initiativ. Uten evne til å igangsette aktiviteter uten hjelp.'
    ]
  },
  q8: {
    labels: [
      'Normal interesse for omgivelsene og andre mennesker.',
      '',
      'Redusert evne til å glede seg over ting som vanligvis gleder. Redusert evne til å føle sinne.',
      '',
      'Tap av interesse for omverdenen. Tap av følelser for venner og bekjente.',
      '',
      'Opplevelsen av å være følelsesmessig lammet, uten evne til å føle sinne eller sorg, og til dels smertefull opplevelse av ikke å kunne føle noe for nære slektninger eller venner.'
    ]
  },
  q9: {
    labels: [
      'Ingen depressive tanker.',
      '',
      'Fluktuerende tanker om ikke å strekke til, selvbebreidelser og mindreverdighetsfølelse.',
      '',
      'Vedvarende selvbebreidelser eller klare, men fortsatt rasjonelle tanker om skyld og synd. Ser uttalt pessimistisk på fremtiden.',
      '',
      'Vrangforestillinger om økonomisk ruin eller utilgivelige synder. Absurde selvanklager.'
    ]
  },
  q10: {
    labels: [
      'Ordinær livslyst, tar det som det kommer.',
      '',
      'Lei av livet, men bare flyktige suicidaltanker.',
      '',
      'Ville helst være død, suicidaltanker opptrer hyppig, og suicid ansees som en mulig løsning uten at det foreligger spesifikke planer eller intensjoner.',
      '',
      'Uttalte planer om suicid når anledningen byr seg. Aktive forberedelser for suicid.'
    ]
  }
};