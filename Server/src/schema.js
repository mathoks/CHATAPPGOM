import gql from "graphql-tag";
export const loader = gql`
" returns a list of Users"
type Query {
    Users(lim: Int, after: String) : UserList
    item(id: ID!): User 
    me: me
    Search(searchText: String, filterText: String) : [User]
    getMainChat: [mainChatList]
    }

union UserList = List | UserError

type UserError {
message: String
code: Int
}

type mainChatList {
    idx: String
    message: String
    user_id: String
    username: String
    timestamp: ID!
}

enum Entities {
STUDENT
GRADUATE
ARTISAN
PROFESSIONAL
}
    type Mutation {
    createUser(info: userSignup): UserRes
    authenticate(credentials: userSignin) : userSignRes
    refresh: String
    rating_like(ids: likes_dislikes): LikedUser
    addChat(info: chatPayload): String
    userTyping(info: notify): Boolean
    }

    input notify {
       isTyping: Boolean 
    }
    # all subscriptions
    
    type Subscription {
        rating_like: LikedUser
        main_chat: message_added
        typing: Boolean
    }


    type message_added {
        message: String
        user_id: String
        timestamp: String
        username: String
    }
   
input chatPayload {
    mess: String
    room_id: Int
}

type userSignRes {
    code: Int
    success: Boolean
    data: String
    message: String
}
type UserRes {
code: Int
success: Boolean
data: User
message: String
}

type ratingRes {
    code: Int,
    message: String,
    error: String
}

type me {
    username: String
    email: String
    firstname: String
    user_id: String
    
}



"Users general info"
interface User @cacheControl(maxAge: 240){
    name: String
    firstname: String
    username: String
    phone: String
    email: String
    user_id: ID!
    idx: Int
    cat_id: Int
    city_id: String
    createdat: String
    about: String
    brandname: String
    category: Category
    city: City
    lastname: String
    total: Int
}

"users basic information supplied"
type Category {
    names: String
}

type City {
    cityname: String
    name: String
}

type State {
    statename: String
}

enum userType {
STUDENT
GRADUATE
ARTISAN
PROFESSIONAL
}

type UserConnection {
    PageInfo: PageInfo
    edges: [UserEdges]
}

type PageInfo {
    endCursor: String
    hasNextPage: Boolean
    first: Boolean
}

type UserEdges {
cursor: String
node: User
}

type LikedUser {
    edges: UserEdges
    TotalCount: ratingRes
}

type List {
    pageInfo: PageInfo!
    edges: [UserEdges]
    
}




type student implements User {
   
   firstname: String
    name:String
    idx: Int
    lastname: String
    username: String
    phone: String
    email: String
    user_id: ID!
    cat_id: Int
    city_id: String
    createdat: String
    about: String
    brandname: String
    category: Category
    city: City
    studinfo: stud
    uniform: String
    total: Int
    
    # pageInfo: [PageInfo]

}
# type Student implements User {
#     firstname: String
#     name:String
#     idx: Int
#     lastname: String
#     username: String
#     phone: String
#     email: String
#     user_id: String
#     cat_id: Int
#     city_id: String
#     CreatedAt: String
#     about: String
#     brandname: String
#     category: Category
#     city: City
#     studinfo: stud
#     uniform: String
# }

type graduate implements User {
    firstname: String
    name:String
    lastname: String
    username: String
    phone: String
    email: String
    user_id: ID!
    cat_id: Int
    idx:Int
    city_id: String
    createdat: String
    about: String
    brandname: String
    category: Category
    city: City
    Gradinfo: Grad
    money: String
    FriendConnection:UserConnection
    total: Int
}

type stud {
    school: String
    Department: String
    levels: String
    gradYear: String
    isIT: Boolean
}

type Grad {
nysc: Boolean
school: String
jobType: String
empStatus: String
openJob: String
prefJob: String
WorkHis: [work]

}

type artisan implements User {
    name:String
    firstname: String
    lastname: String
    username: String
    phone: String
    email: String
    user_id: ID!
    cat_id: Int
    city_id: String
    idx: Int
    createdat: String
    about: String
    brandname: String
    category: Category
    city: City
    shop: Boolean
    adderess: String
    money: String
    total: Int
}

type professional implements User {
    firstname: String
    name:String
    lastname: String
    username: String
    phone: String
    email: String
    user_id: ID!
    cat_id: Int
    city_id: String
    createdat: String
    about: String
    brandname: String
    category: Category
    city: City
    idx: Int
    proInfo: Pro
    money: String
    total: Int
}


type stud {
    school: String
    Department: String
    levels: String
    gradYear: String
    isIT: Boolean
}

type Pro {
    name: String
    certification: [String]
    competence: String
    experience: Int
}

type Grad {
nysc: Boolean
school: String
jobType: String
empStatus: String
openJob: String
prefJob: String
WorkHis: [work]

}

type stud {
    school: String
    Department: String
    levels: String
    gradYear: String
    isIT: Boolean
}

type Grad {
nysc: Boolean
school: String
jobType: String
empStatus: String
openJob: String
prefJob: String
WorkHis: [work]

}



enum Job {
fulltime
parttime
}

type work {
    company: String
    roles: String
    EEnd: Int
    SStart: Int
    ddescription: String
    createdAt: String
    updatedAt: String
}



" imput for creating new user"
input userSignup {
    firstname: String!
    lastname: String!
    username: String!
    phone: String!
    password: String!
    email: String
    location: Place!
    category: userType!
}

input userSignin {
    username: String!
    password: String!
}

input likes_dislikes {
    liked_id: ID!
}

enum CacheControlScope {
  PUBLIC
  PRIVATE
}

directive @cacheControl(
  maxAge: Int
  scope: CacheControlScope
  inheritMaxAge: Boolean
) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION


 enum Place {
        aba_north
        aba_south
        arochukwu
        bende
        ikwuano
        isiala_ngwa_north
        isiala_ngwa_south
        isuikwato
        obi_nwa
        ohafia
        osisioma
        ngwa
        ugwunagbo
        ukwa_east
        ukwa_west
        umuahia_north
        umuahia_south
        umu_neochi
        demsa
        fufore
        ganaye
        gireri
        gombi
        guyuk
        hong
        jada
        lamurde
        madagali
        maiha
        mayo_belwa
        michika
        mubi_north
        mubi_south
        numan
        shelleng
        song
        toungo
        yola_north
        yola_south
        aguata
        anambra_east
        anambra_west
        anaocha
        awka_north
        awka_south
        ayamelum
        dunukofia
        ekwusigo
        idemili_north
        idemili_south
        ihiala
        njikoka
        nnewi_north
        nnewi_south
        ogbaru
        onitsha_north
        onitsha_south
        orumba_north
        orumba_south
        oyi
        abak
        eastern_obolo
        eket
        esit_eket
        essien_udim
        etim_ekpo
        etinan
        ibeno
        ibesikpo_asutan
        ibiono_ibom
        ika
        ikono
        ikot_abasi
        ikot_ekpene
        ini
        itu
        mbo
        mkpat_enin
        nsit_atai
        nsit_ibom
        nsit_ubium
        obot_akara
        okobo
        onna
        oron
        oruk_anam
        udung_uko
        ukanafun
        uruan
        urue_offong_oruko
        uyo
        alkaleri
        bauchi
        bogoro
        damban
        darazo
        dass
        ganjuwa
        giade
        itas_gadau
        jamaare
        katagum
        kirfi
        misau
        ningi
        shira
        tafawa_balewa
        toro
        warji
        zaki
        brass
        ekeremor
        kolokuma_opokuma
        nembe
        ogbia
        sagbama
        southern_jaw
        yenegoa
        ado
        agatu
        apa
        buruku
        gboko
        guma
        gwer_east
        gwer_west
        katsina_ala
        konshisha
        kwande
        logo
        makurdi
        obi
        ogbadibo
        oju
        okpokwu
        ohimini
        oturkpo
        tarka
        ukuma
        ushongo
        vandeikya
        abadam
        askira_uba
        bama
        bayo
        biu
        chibok
        damboa
        dikwa
        gubio
        guzamala
        gwoza
        hawul
        jere
        kaga
        kala_balge
        konduga
        kukawa
        kwaya_kusar
        mafa
        magumeri
        maiduguri
        marte
        mobbar
        monguno
        ngala
        nganzai
        shani
        akpabuyo
        odukpani
        akamkpa
        biase
        abi
        ikom
        yarkur
        odubra
        boki
        ogoja
        yala
        obanliku
        obudu
        calabar_south
        etung
        bekwara
        bakassi
        calabar_municipality
        oshimili
        aniocha
        aniocha_south
        ika_south
        ika_north_east
        ndokwa_west
        ndokwa_east
        isoko_south
        isoko_north
        bomadi
        burutu
        ughelli_south
        ughelli_north
        ethiope_west
        ethiope_east
        sapele
        okpe
        warri_north
        warri_south
        uvwie
        udu
        warri_central
        ukwani
        oshimili_north
        patani
        edda
        afikpo
        onicha
        ohaozara
        ashielu
        ikwo
        ezza
        ezza_south
        ohaukwu
        ebonyi
        ivo
        enugu_south
        igbo_eze_south
        enugu_north
        nkanu
        udi_agwu
        oji_river
        ezeagu
        igboeze_north
         isi_uzo
        nsukka
        igbo_ekiti
        uzo_uwani
        enugu_east
        aninri
        nkanu_east
        udenu
        esan_north_east
        esan_central
        esan_west
        egor
        ukpoba     
        central
        etsako_central
        igueben
        oredo
        ovia_southwest
        ovia_southeast
        orhionwon
        uhunmwonde
        etsako_east
        esan_south_east
        ado_ekiti
        ekiti_east
        ekiti_west
        emure
        ekiti_south_west
        ikere
        irepodun
        ijero
        ido_osi
        oye
        ikole
        moba
        gbonyin
        efon
        ise_orun
        ilejemeje
        abaji
        abuja_municipal
        bwari
        gwagwalada
        kuje
        kwali
        akko
        balanga
        billiri
        dukku
        kaltungo
        kwami
        shomgom
        funakaye
        gombe
        nafada_bajoga
        yamaltu_delta
        aboh_mbaise
        ahiazu_mbaise
        ehime_mbano
        ezinihitte
        ideato_north
        ideato_south
        ihitte_uboma
        ikeduru
        isiala_mbano
        isu
        mbaitoli
        ngor_okpala
        njaba
        nwangele
        nkwerre
        obowo
        oguta
        ohaji_egbema
        okigwe
        orlu
        orsu
        oru_east
        oru_west
        owerri_municipal
        owerri_north
        owerri_west
        auyo
        babura
        birni_kudu
        biriniwa
        buji
        dutse
        gagarawa
        garki
        gumel
        guri
        gwaram
        gwiwa
        hadejia
        jahun
        kafin_hausa
        kaugama_azaure
        kiri_kasamma
        kiyawa
        maigatari
        malam_madori
        miga
        ringim
        roni
        sule_tankarkar
        taura
        yankwashi
        birni_gwari
        chikun
        giwa
        igabi
        ikara
        jaba
        jemaa
        kachia
        kaduna_north
        kaduna_south
        kagarko
        kajuru
        kaura
        kauru
        kubau
        kudan
        lere
        makarfi
        sabon_gari
        sanga
        soba
        zango_kataf
        zaria
        ajingi
        albasu
        bagwai
        Bebeji
        bichi
        Bunkure
        dala
        dambatta
        dawakin_kudu
        dawakin_tofa
        doguwa
        fagge
        gabasawa
        garko
        garum
        mallam
        gaya
        gezawa
        gwale
        gwarzo
        kabo
        kano_municipal
        karaye
        kibiya
        kiru
        kumbotso
        ghari
        kura
        madobi
        makoda
        minjibir
        nasarawa
        rano
        rimin_gado
        rogo
        shanono
        sumaila
        takali
        tarauni
        tofa
        tsanyawa
        tudun_wada
        ungogo
        warawa
        wudil
        bakori
        batagarawa
        batsari
        baure
        bindawa
        charanchi
        dandume
        danja
        dan_musa
        daura
        Dutsi
        dutsin_ma
        faskari
        funtua
        ingawa
        jibia
        kafur
        kaita
        kankara
        kankia
        katsina
        kurfi
        kusada
        mai_adua
        malumfashi
        mani
        mashi
        matazuu
        musawa
        rimi
        sabuwa
        safana
        sandamu
        zango
        aleiro
        arewa_dandi
        argungu
        augie
        bagudo
        birnin_kebbi
        bunza
        dandi
        fakai
        gwandu
        jega
        kalgo
        koko_besse
        maiyama
        ngaski
        sakaba
        shanga
        suru
        wasagu_danko
        yauri
        zuru
        adavi
        ajaokuta
        ankpa
        bassa
        dekina
        ibaji
        idah
        igalamela_odolu
        ijumu
        kabba_bunu
        kogi
        lokoja
        mopa_muro
        ofu
        ogori_mangongo
        okehi
        okene
        olamabolo
        omala
        yagba_east
        yagba_west
        asa
        baruten
        edu
        ekiti
        ifelodunn
        ilorin_east
        ilorin_west
        irepodunn
        isin
        kaiama
        moro
        offa
        oke_ero
        oyun
        pategi
        agege
        ajeromi_ifelodun
        alimosho
        amuwo_odofin
        festac
        apapa
        badagry
        epe
        eti_osa
        ibeju_lekki
        ifako_ijaye
        ikeja
        ikorodu
        kosofe
        lagos_island
        lagos_mainland
        mushin
        ojo
        oshodi_isolo
        shomolu
        surulere
        akwanga
        awe
        doma
        karu
        keana
        keffi
        kokona
        lafia
        nassarawa
        nasarawa_eggon
        obii
        toto
        wamba
        agaie
        agwara
        bida
        borgu
        bosso
        chanchaga
        edati
        gbako
        gurara
        katcha
        kontagora
        lapai
        lavun
        magama
        mariga
        mashegu
        mokwa
        muya
        pailoro
        rafi
        rijau
        shiroro
        suleja
        tafa
        wushishi
        abeokuta_north
        abeokuta_south
        ado_odo
        ota
        yewa_north
        yewa_south
        ewekoro
        ifo
        ijebu_east
        ijebu_north
        ijebu_north_east
        ijebu_ode
        ikenne
        imeko_afon
        ipokia
        obafemi_owode
        ogun_waterside
        odeda
        odogbolu
        remo_north
        shagamu
        akoko_north_east
        akoko_north_west
        akoko_south_akure_east
        akoko_south_west
        akure_north
        akure_south
        ese_odo
        idanre
        ifedore
        ilaje
        ile_oluji
        okeigbo
        irele
        odigbo
        okitipupa
        ondo_east
        ondo_west
        ose
        owo
        aiyedade
        aiyedire
        atakumosa_east
        atakumosa_west
        boluwaduro
        boripe
        ede_north
        ede_south
        egbedore
        ejigbo
        ife_central
        ife_east
        ife_north
        ife_south
        ifedayo
        ifelodun_osun
        ila
        ilesha_east
        ilesha_west
        irepodun_osun
        irewole
        isokan
        iwo
        obokun
        odo_otin
        ola_oluwa
        olorunda
        oriade
        orolu
        osogbo
        afijio
        akinyele
        atiba
        atisbo
        egbeda
        ibadan_central
        ibadan_north
        ibadan_north_west
        ibadan_south_east
        ibadan_south_west
        ibarapa_central
        ibarapa_east
        ibarapa_north
        ido
        irepo
        iseyin
        itesiwaju
        iwajowa
        kajola
        lagelu_ogbomosho_north
        ogbomosho_south
        ogo_oluwa
        olorunsogo
        oluyole
        ona_ara
        orelope
        ori_ire
        oyo_east
        oyo_west
        saki_east
        saki_west
        surulere_oyo
        barikin_ladi
        bassa_plateau
        bokkos
        jos_east
        jos_north
        jos_south
        kanam
        kanke
        langtang_north
        langtang_south
        mangu
        mikang
        pankshin
        quaan_pan
        riyom
        shendam
        wase
        abua
        odual
        ahoada_east
        ahoada_west
        akuku_toru
        andoni
        asari_toru
        bonny
        degema
        emohua
        eleme
        etche
        gokana
        ikwerre
        khana
        obio_akpor
        ogba
        egbema_ndoni
        ogu_bolo
        okrika
        omumma
        opobo_nkoro
        oyigbo
        port_harcourt
        tai
        binji
        bodinga
        dange_shnsi
        gada
        goronyo
        gudu
        gawabawa
        illela
        isa
        kware
        kebbe
        rabah
        sabon_birni
        shagari
        silame
        sokoto_north
        sokoto_south
        tambuwal
        tqngaza
        tureta
        wamako
        wurno
        yabo
        taraba
        ardo_kola
        bali
        donga
        gashaka
        cassol
        ibi
        jalingo
        karin_lamido
        kurmi
        lau
        sardauna
        takum
        ussa
        wukari
        yorro
        zing
        yobe
        bade
        bursari
        damaturu
        fika
        fune
        geidam
        gujba
        gulani
        jakusko
        karasuwa
        karawa
        machina
        nangere
        nguru_potiskum
        tarmua
        yunusari
        yusufari
        anka
        bakura
        birnin_magaji
        bukkuyum
        bungudu
        gummi
        gusau
        kauura
        namoda
        maradun
        maru
        shinkafi
        talata_mafara
        tsafe
        zurmi
    
}
`;
