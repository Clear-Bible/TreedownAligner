const cachedSyntaxData: Record<string, string> = {
  'Gen.1.1': `<sentences xml:lang="heb" ref="GEN 1:1">
<sentence>
<p>
<milestone unit="verse" id="GEN 1:1">GEN 1:1</milestone>
בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃
</p>
<wg class="cl" Head="false" id="0100100100110110" Rule="pp-v-s-o">
<wg role="pp" class="pp" Head="false" id="0100100100110020" Rule="prepnp">
<w ref="GEN 1:1!1" id="o010010010011" Cat="prep" Unicode="בְּ" morph="R" lang="H" lemma="b" pos="preposition">בְּ</w>
<w ref="GEN 1:1!1" id="o010010010012" Cat="noun" Unicode="רֵאשִׁ֖ית" morph="Ncfsa" lang="H" lemma="7225" pos="noun" gender="feminine" number="singular" state="absolute" after=" ">רֵאשִׁ֖ית</w>
</wg>
<w ref="GEN 1:1!2" role="v" id="o010010010021" Cat="verb" Unicode="בָּרָ֣א" morph="Vqp3ms" lang="H" lemma="1254 a" pos="verb" gender="masculine" number="singular" stem="qal" person="third" after=" ">בָּרָ֣א</w>
<w ref="GEN 1:1!3" role="s" id="o010010010031" Cat="noun" Unicode="אֱלֹהִ֑ים" morph="Ncmpa" lang="H" lemma="430" pos="noun" gender="masculine" number="plural" state="absolute" after=" ">אֱלֹהִ֑ים</w>
<wg role="o" class="np" Head="true" id="0100100100410070" Rule="npanp">
<wg class="np" Head="false" id="0100100100410030" Rule="ompnp">
<w ref="GEN 1:1!4" id="o010010010041" Cat="om" Unicode="אֵ֥ת" morph="To" lang="H" lemma="853" pos="particle" after=" ">אֵ֥ת</w>
<wg class="np" Head="false" id="0100100100510020" Rule="detnp">
<w ref="GEN 1:1!5" id="o010010010051" Cat="art" Unicode="הַ" morph="Td" lang="H" lemma="d" pos="particle">הַ</w>
<w ref="GEN 1:1!5" id="o010010010052" Cat="noun" Unicode="שָּׁמַ֖יִם" morph="Ncmpa" lang="H" lemma="8064" pos="noun" gender="masculine" number="plural" state="absolute" after=" ">שָּׁמַ֖יִם</w>
</wg>
</wg>
<w ref="GEN 1:1!6" id="o010010010061" Cat="cj" Unicode="וְ" morph="C" lang="H" lemma="c" pos="conjunction">וְ</w>
<wg class="np" Head="false" id="0100100100620030" Rule="ompnp">
<w ref="GEN 1:1!6" id="o010010010062" Cat="om" Unicode="אֵ֥ת" morph="To" lang="H" lemma="853" pos="particle" after=" ">אֵ֥ת</w>
<wg class="np" Head="false" id="0100100100710020" Rule="detnp">
<w ref="GEN 1:1!7" id="o010010010071" Cat="art" Unicode="הָ" morph="Td" lang="H" lemma="d" pos="particle">הָ</w>
<w ref="GEN 1:1!7" id="o010010010072" Cat="noun" Unicode="אָֽרֶץ" morph="Ncbsa" lang="H" lemma="776" pos="noun" gender="both" number="singular" state="absolute" after="׃">אָֽרֶץ</w>
</wg>
</wg>
</wg>
</wg>
</sentence>
</sentences>`,
  'Mark.16.1': `<sentences xml:lang="grc" ref="MRK 16:1">
<sentence>
<p>
<milestone unit="verse" id="MRK 16:1">MRK 16:1</milestone>
Καὶ διαγενομένου τοῦ σαββάτου Μαρία ἡ Μαγδαληνὴ καὶ Μαρία ἡ τοῦ Ἰακώβου καὶ Σαλώμη ἠγόρασαν ἀρώματα ἵνα ἐλθοῦσαι ἀλείψωσιν αὐτόν.
</p>
<wg role="cl">
<wg class="cl" rule="Conj-CL" id="410160010010200">
<w ref="MRK 16:1!1" class="conj" id="n41016001001" lemma="καί" normalized="Καί" strong="2532">Καὶ</w>
<wg class="cl" rule="V-S" id="410160010020030">
<w role="v" ref="MRK 16:1!2" class="verb" id="n41016001002" lemma="διαγίνομαι" normalized="διαγενομένου" strong="1230" number="singular" gender="neuter" case="genitive" tense="aorist" voice="middle" mood="participle" type="?" head="true">διαγενομένου</w>
<wg role="s" id="410160010030021" class="np" articular="true" rule="DetNP">
<w ref="MRK 16:1!3" class="det" id="n41016001003" lemma="ὁ" normalized="τοῦ" strong="3588" number="singular" gender="neuter" case="genitive">τοῦ</w>
<w ref="MRK 16:1!4" class="noun" type="common" id="n41016001004" lemma="σάββατον" normalized="σαββάτου" strong="4521" number="singular" gender="neuter" case="genitive" head="true">σαββάτου</w>
</wg>
</wg>
<wg class="cl" head="true" rule="S-V-O" id="410160010050120">
<wg role="s" id="410160010050101" class="np" rule="Conj3Np">
<wg class="np" head="true" rule="Np-Appos" id="410160010050030">
<w ref="MRK 16:1!5" class="noun" type="proper" id="n41016001005" lemma="Μαρία" normalized="Μαρία" strong="3137" number="singular" gender="feminine" case="nominative" head="true">Μαρία</w>
<wg class="np" articular="true" rule="DetNP" id="410160010060020">
<w ref="MRK 16:1!6" class="det" id="n41016001006" lemma="ὁ" normalized="ἡ" strong="3588" number="singular" gender="feminine" case="nominative">ἡ</w>
<w ref="MRK 16:1!7" class="noun" type="proper" id="n41016001007" lemma="Μαγδαληνή" normalized="Μαγδαληνή" strong="3094" number="singular" gender="feminine" case="nominative" head="true">Μαγδαληνὴ</w>
</wg>
</wg>
<w ref="MRK 16:1!8" class="conj" id="n41016001008" lemma="καί" normalized="καί" strong="2532">καὶ</w>
<wg class="np" rule="Np-Appos" id="410160010090040">
<w ref="MRK 16:1!9" class="noun" type="proper" id="n41016001009" lemma="Μαρία" normalized="Μαρία" strong="3137" number="singular" gender="feminine" case="nominative" head="true">Μαρία</w>
<wg class="np" rule="NPofNP" id="410160010100030">
<w ref="MRK 16:1!10" class="det" id="n41016001010" lemma="ὁ" normalized="ἡ" strong="3588" number="singular" gender="feminine" case="nominative" head="true">ἡ</w>
<wg class="np" articular="true" rule="DetNP" id="410160010110020">
<w ref="MRK 16:1!11" class="det" id="n41016001011" lemma="ὁ" normalized="τοῦ" strong="3588" number="singular" gender="masculine" case="genitive">τοῦ</w>
<w ref="MRK 16:1!12" class="noun" type="proper" id="n41016001012" lemma="Ἰάκωβος" normalized="Ἰακώβου" strong="2385" number="singular" gender="masculine" case="genitive" head="true">Ἰακώβου</w>
</wg>
</wg>
</wg>
<w ref="MRK 16:1!13" class="conj" id="n41016001013" lemma="καί" normalized="καί" strong="2532">καὶ</w>
<w ref="MRK 16:1!14" class="noun" type="proper" id="n41016001014" lemma="Σαλώμη" normalized="Σαλώμη" strong="4539" number="singular" gender="feminine" case="nominative">Σαλώμη</w>
</wg>
<w role="v" ref="MRK 16:1!15" class="verb" id="n41016001015" lemma="ἀγοράζω" normalized="ἠγόρασαν" strong="59" number="plural" person="third" tense="aorist" voice="active" mood="indicative" head="true">ἠγόρασαν</w>
<w role="o" ref="MRK 16:1!16" class="noun" type="common" id="n41016001016" lemma="ἄρωμα" normalized="ἀρώματα" strong="759" number="plural" gender="neuter" case="accusative">ἀρώματα</w>
</wg>
<wg class="cl" rule="sub-CL" id="410160010170040">
<w ref="MRK 16:1!17" class="conj" id="n41016001017" lemma="ἵνα" normalized="ἵνα" strong="2443">ἵνα</w>
<wg class="cl" rule="ADV-V-O" id="410160010180030">
<w role="adv" ref="MRK 16:1!18" class="verb" id="n41016001018" lemma="ἔρχομαι" normalized="ἐλθοῦσαι" strong="2064" number="plural" gender="feminine" case="nominative" tense="aorist" voice="active" mood="participle" type="?">ἐλθοῦσαι</w>
<w role="v" ref="MRK 16:1!19" class="verb" id="n41016001019" lemma="ἀλείφω" normalized="ἀλείψωσιν" strong="218" number="plural" person="third" tense="aorist" voice="active" mood="subjunctive" head="true">ἀλείψωσιν</w>
<w role="o" ref="MRK 16:1!20" class="pron" type="personal" id="n41016001020" lemma="αὐτός" normalized="αὐτόν" strong="846" number="singular" gender="masculine" case="accusative">αὐτόν.</w>
</wg>
</wg>
</wg>
</wg>
</sentence>
</sentences>`,
  'Rom.5.3': `<sentences xml:lang="grc" ref="ROM 5:3">
<sentence>
<p>
<milestone unit="verse" id="ROM 5:3">ROM 5:3</milestone>
<milestone unit="verse" id="ROM 5:4">ROM 5:4</milestone>
οὐ μόνον δέ, ἀλλὰ καὶ καυχώμεθα ἐν ταῖς θλίψεσιν, εἰδότες ὅτι ἡ θλῖψις ὑπομονὴν κατεργάζεται, ἡ δὲ ὑπομονὴ δοκιμήν, ἡ δὲ δοκιμὴ ἐλπίδα·
</p>
<wg role="cl">
<wg class="cl" rule="Conj-CL" id="450050030030230">
<w ref="ROM 5:3!3" class="conj" id="n45005003003" lemma="δέ" normalized="δέ" strong="1161" discontinuous="true">δέ,</w>
<wg class="cl" rule="notCLbutCL2CL" id="450050030010220">
<w ref="ROM 5:3!1" class="adv" id="n45005003001" lemma="οὐ" normalized="οὐ" strong="3756">οὐ</w>
<wg class="cl" rule="ADV2CL" id="450050030020013">
<w role="adv" ref="ROM 5:3!2" class="adj" id="n45005003002" lemma="μόνος" normalized="μόνον" strong="3440" number="singular" gender="neuter" case="accusative">μόνον</w>
</wg>
<w ref="ROM 5:3!4" class="conj" id="n45005003004" lemma="ἀλλά" normalized="ἀλλά" strong="235">ἀλλὰ</w>
<wg class="cl" head="true" rule="ADV-V-ADV-ADV" id="450050030050190">
<w role="adv" ref="ROM 5:3!5" class="adv" id="n45005003005" lemma="καί" normalized="καί" strong="2532">καὶ</w>
<w role="v" ref="ROM 5:3!6" class="verb" id="n45005003006" lemma="καυχάομαι" normalized="καυχώμεθα" strong="2744" number="plural" person="first" tense="present" voice="middlepassive" mood="indicative" head="true">καυχώμεθα</w>
<wg role="adv" id="450050030070031" class="pp" articular="true" rule="PrepNp">
<w ref="ROM 5:3!7" class="prep" id="n45005003007" lemma="ἐν" normalized="ἐν" strong="1722">ἐν</w>
<wg class="np" articular="true" head="true" rule="DetNP" id="450050030080020">
<w ref="ROM 5:3!8" class="det" id="n45005003008" lemma="ὁ" normalized="ταῖς" strong="3588" number="plural" gender="feminine" case="dative">ταῖς</w>
<w ref="ROM 5:3!9" class="noun" type="common" id="n45005003009" lemma="θλῖψις" normalized="θλίψεσιν" strong="2347" number="plural" gender="feminine" case="dative" head="true">θλίψεσιν,</w>
</wg>
</wg>
<wg role="adv" id="450050030100141" class="cl" rule="ClCl">
<wg class="cl" head="true" rule="V2CL" id="450050030100013">
<w role="v" ref="ROM 5:3!10" class="verb" id="n45005003010" lemma="οἶδα" normalized="εἰδότες" strong="1492" number="plural" gender="masculine" case="nominative" tense="perfect" voice="active" mood="participle" type="?" head="true">εἰδότες</w>
</wg>
<wg class="cl" rule="that-VP" id="450050030110130">
<w ref="ROM 5:3!11" class="conj" id="n45005003011" lemma="ὅτι" normalized="ὅτι" strong="3754">ὅτι</w>
<wg class="cl" rule="Conj3CL" id="450050030120120">
<wg class="cl" head="true" rule="S-O-V" id="450050030120040">
<wg role="s" id="450050030120021" class="np" articular="true" rule="DetNP">
<w ref="ROM 5:3!12" class="det" id="n45005003012" lemma="ὁ" normalized="ἡ" strong="3588" number="singular" gender="feminine" case="nominative">ἡ</w>
<w ref="ROM 5:3!13" class="noun" type="common" id="n45005003013" lemma="θλῖψις" normalized="θλῖψις" strong="2347" number="singular" gender="feminine" case="nominative" head="true">θλῖψις</w>
</wg>
<w role="o" ref="ROM 5:3!14" class="noun" type="common" id="n45005003014" lemma="ὑπομονή" normalized="ὑπομονήν" strong="5281" number="singular" gender="feminine" case="accusative">ὑπομονὴν</w>
<w role="v" ref="ROM 5:3!15" class="verb" id="n45005003015" lemma="κατεργάζομαι" normalized="κατεργάζεται" strong="2716" number="singular" person="third" tense="present" voice="middlepassive" mood="indicative" head="true">κατεργάζεται,</w>
</wg>
<w ref="ROM 5:4!2" class="conj" id="n45005004002" lemma="δέ" normalized="δέ" strong="1161" discontinuous="true">δὲ</w>
<wg class="cl" articular="true" rule="S-O" id="450050040010030">
<wg role="s" id="450050040010021" class="np" articular="true" head="true" rule="DetNP">
<w ref="ROM 5:4!1" class="det" id="n45005004001" lemma="ὁ" normalized="ἡ" strong="3588" number="singular" gender="feminine" case="nominative">ἡ</w>
<w ref="ROM 5:4!3" class="noun" type="common" id="n45005004003" lemma="ὑπομονή" normalized="ὑπομονή" strong="5281" number="singular" gender="feminine" case="nominative" head="true">ὑπομονὴ</w>
</wg>
<w role="o" ref="ROM 5:4!4" class="noun" type="common" id="n45005004004" lemma="δοκιμή" normalized="δοκιμήν" strong="1382" number="singular" gender="feminine" case="accusative">δοκιμήν,</w>
</wg>
<w ref="ROM 5:4!6" class="conj" id="n45005004006" lemma="δέ" normalized="δέ" strong="1161" discontinuous="true">δὲ</w>
<wg class="cl" articular="true" rule="S-O" id="450050040050030">
<wg role="s" id="450050040050021" class="np" articular="true" head="true" rule="DetNP">
<w ref="ROM 5:4!5" class="det" id="n45005004005" lemma="ὁ" normalized="ἡ" strong="3588" number="singular" gender="feminine" case="nominative">ἡ</w>
<w ref="ROM 5:4!7" class="noun" type="common" id="n45005004007" lemma="δοκιμή" normalized="δοκιμή" strong="1382" number="singular" gender="feminine" case="nominative" head="true">δοκιμὴ</w>
</wg>
<w role="o" ref="ROM 5:4!8" class="noun" type="common" id="n45005004008" lemma="ἐλπίς" normalized="ἐλπίδα" strong="1680" number="singular" gender="feminine" case="accusative">ἐλπίδα·</w>
</wg>
</wg>
</wg>
</wg>
</wg>
</wg>
</wg>
</wg>
</sentence>
</sentences>`,
};

export default cachedSyntaxData;
