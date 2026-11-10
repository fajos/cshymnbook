export interface EnglishStanza {
  number: string;
  text: string;
  chorus?: string;
}

export interface EnglishHymn {
  hymnId: number;
  englishTitle: string;
  author?: string;
  stanzas: EnglishStanza[];
}

export const ENGLISH_HYMNS: Record<number, EnglishHymn> = {
  // Hymn 1: Akunleko i
  1: {
    hymnId: 1,
    englishTitle: 'God is a Spirit: And They That Worship Him',
    author: 'Liturgical Scripture (John 4:24)',
    stanzas: [
      {
        number: '1.',
        text: 'God is a Spirit, holy and divine;\nThey that do worship Him in truth shall shine;\nIn spirit and in truth let all bow down,\nAnd seek His mercy and His glorious crown.',
        chorus: 'Refrain:\tHoly, Holy, Holy Lord of hosts,\n\t\t\t\tThy sacred name is praised to uttermost;\n\t\t\t\tKeep us forever in Thy Seraph band,\n\t\t\t\tAnd guide our footsteps to the promised land.',
      },
      {
        number: '2.',
        text: 'Before Thy presence, Lord, we lowly fall;\nHear Thou our prayers and answer when we call;\nWash all our sins in Jesus’ precious blood,\nAnd fill our spirits with Thy living flood.',
      },
    ],
  },

  // Hymn 4: Akunleko iv
  4: {
    hymnId: 4,
    englishTitle: 'Our Heavenly Father, We Have Come Today',
    author: 'C&S Traditional Kneeling Air',
    stanzas: [
      {
        number: '1.',
        text: 'Our Father, we have come before Thy throne today!\nBehold Thy children kneeling as we pray;\nLook down with pity from Thy throne on high,\nAnd send Thy grace in answer to our cry.',
        chorus: 'Refrain:\tFather, hear us, merciful and mild,\n\t\t\t\tGrant Thy blessing to each kneeling child.',
      },
      {
        number: '2.',
        text: 'No other help nor refuge can we find,\nO gentle Saviour, Lover of mankind;\nLet holy peace descend upon this place,\nAnd wrap our souls in Thine unfailing grace.',
      },
    ],
  },

  // Hymn 46: K&S 1
  46: {
    hymnId: 46,
    englishTitle: 'Awake, My Soul, and with the Sun',
    author: 'Thomas Ken (1637–1711)',
    stanzas: [
      {
        number: '1.',
        text: 'Awake, my soul, and with the sun\nThy daily stage of duty run;\nShake off dull sloth, and joyful rise\nTo pay thy morning sacrifice.',
      },
      {
        number: '2.',
        text: 'Thy precious time misspent redeem,\nEach present day thy last esteem,\nImprove thy talent with due care;\nFor the great day thyself prepare.',
      },
      {
        number: '3.',
        text: 'By influence of the light divine\nLet thy own light to others shine.\nReflect all Heav’n’s propitious rays\nIn ardent love and cheerful praise.',
      },
      {
        number: '4.',
        text: 'All praise to Thee, Who safe hast kept\nAnd hast refreshed me whilst I slept.\nGrant, Lord, when I from death shall wake\nI may of endless light partake.',
      },
      {
        number: '5.',
        text: 'Praise God, from Whom all blessings flow;\nPraise Him, all creatures here below;\nPraise Him above, ye heav’nly host;\nPraise Father, Son, and Holy Ghost.',
      },
    ],
  },

  // Hymn 47: K&S 2
  47: {
    hymnId: 47,
    englishTitle: 'Awake, My Soul, to Meet the Day',
    author: 'Philip Doddridge (1702–1751)',
    stanzas: [
      {
        number: '1.',
        text: 'Awake, my soul, to meet the day;\nUnfold thy drowsy eyes,\nAnd burst the heavy bonds of sleep\nIn hymns of praise to rise.',
      },
      {
        number: '2.',
        text: 'God’s hand hath guided me through night,\nSafe in His holy care;\nHis angels watched around my bed,\nAnd made my peace their prayer.',
      },
      {
        number: '3.',
        text: 'Grant me Thy grace, O Lord, today,\nIn all my works and ways,\nThat every thought and word and deed\nMay magnify Thy praise.',
      },
    ],
  },

  // Hymn 48: K&S 3
  48: {
    hymnId: 48,
    englishTitle: 'In All the Perils of the Night',
    author: 'Thomas Ken / Traditional',
    stanzas: [
      {
        number: '1.',
        text: 'In all the perils of the night\nThy mercy was our shield;\nThy holy light hath chased our fears,\nThy grace is now revealed.',
      },
      {
        number: '2.',
        text: 'Lord, keep our feet from paths of sin,\nDirect our minds above;\nLet every morning bring afresh\nThe knowledge of Thy love.',
      },
    ],
  },

  // Hymn 50: K&S 5
  50: {
    hymnId: 50,
    englishTitle: 'Come to the Morning Prayer',
    author: 'James Montgomery (1771–1854)',
    stanzas: [
      {
        number: '1.',
        text: 'Come to the morning prayer,\nCome let us kneel and pray;\nPrayer is the Christian pilgrim’s staff\nTo walk with God all day.',
      },
      {
        number: '2.',
        text: 'At early dawn, on bended knee,\nLift up thy heart in praise;\nGod hears the softest whisper raised,\nAnd guides in all thy ways.',
      },
    ],
  },

  // Hymn 54: K&S 9
  54: {
    hymnId: 54,
    englishTitle: 'At Even, Ere the Sun Was Set',
    author: 'Henry Twells (1823–1900)',
    stanzas: [
      {
        number: '1.',
        text: 'At even, ere the sun was set,\nThe sick, O Lord, around Thee lay;\nO in what divers pains they met!\nO with what joy they went away!',
      },
      {
        number: '2.',
        text: 'Once more ’tis eventide, and we\nOppressed with various ills draw near;\nWhat if Thy form we cannot see?\nWe know and feel that Thou art here.',
      },
      {
        number: '3.',
        text: 'O Saviour Christ, our woes dispel,\nFor some are sick, and some are sad,\nAnd some have never loved Thee well,\nAnd some have lost the love they had.',
      },
      {
        number: '4.',
        text: 'Thy touch has still its ancient pow’r;\nNo word from Thee can fruitless fall;\nHear in this solemn evening hour,\nAnd in Thy mercy heal us all.',
      },
    ],
  },

  // Hymn 60: K&S 15
  60: {
    hymnId: 60,
    englishTitle: 'Lead, Kindly Light, Amid the Encircling Gloom',
    author: 'John Henry Newman (1801–1890)',
    stanzas: [
      {
        number: '1.',
        text: 'Lead, kindly Light, amid the encircling gloom,\nLead Thou me on;\nThe night is dark, and I am far from home,\nLead Thou me on.\nKeep Thou my feet; I do not ask to see\nThe distant scene; one step enough for me.',
      },
      {
        number: '2.',
        text: 'I was not ever thus, nor prayed that Thou\nShouldst lead me on;\nI loved to choose and see my path; but now\nLead Thou me on.\nI loved the garish day, and, spite of fears,\nPride ruled my will: remember not past years.',
      },
      {
        number: '3.',
        text: 'So long Thy pow’r hath blest me, sure it still\nWill lead me on,\nO’er moor and fen, o’er crag and torrent, till\nThe night is gone,\nAnd with the morn those angel faces smile,\nWhich I have loved long since, and lost awhile.',
      },
    ],
  },

  // Hymn 64: K&S 19
  64: {
    hymnId: 64,
    englishTitle: 'Sun of My Soul, Thou Saviour Dear',
    author: 'John Keble (1792–1866)',
    stanzas: [
      {
        number: '1.',
        text: 'Sun of my soul, Thou Saviour dear,\nIt is not night if Thou be near;\nO may no earthborn cloud arise\nTo hide Thee from Thy servant’s eyes.',
      },
      {
        number: '2.',
        text: 'When the soft dews of kindly sleep\nMy wearied eyelids gently steep,\nBe my last thought, how sweet to rest\nFor ever on my Saviour’s breast.',
      },
      {
        number: '3.',
        text: 'Abide with me from morn till eve,\nFor without Thee I cannot live;\nAbide with me when night is nigh,\nFor without Thee I dare not die.',
      },
    ],
  },

  // Hymn 65: K&S 19 Part 2
  65: {
    hymnId: 65,
    englishTitle: 'Abide with Me; Fast Falls the Eventide',
    author: 'Henry Francis Lyte (1793–1847)',
    stanzas: [
      {
        number: '1.',
        text: 'Abide with me: fast falls the eventide;\nThe darkness deepens; Lord, with me abide:\nWhen other helpers fail, and comforts flee,\nHelp of the helpless, O abide with me.',
      },
      {
        number: '2.',
        text: 'Swift to its close ebbs out life’s little day;\nEarth’s joys grow dim, its glories pass away;\nChange and decay in all around I see;\nO Thou Who changest not, abide with me.',
      },
      {
        number: '3.',
        text: 'I need Thy presence every passing hour;\nWhat but Thy grace can foil the tempter’s pow’r?\nWho like Thyself my guide and stay can be?\nThrough cloud and sunshine, Lord, abide with me.',
      },
      {
        number: '4.',
        text: 'Hold Thou Thy cross before my closing eyes;\nShine through the gloom, and point me to the skies:\nHeav’n’s morning breaks, and earth’s vain shadows flee;\nIn life, in death, O Lord, abide with me.',
      },
    ],
  },

  // Hymn 66: K&S 20
  66: {
    hymnId: 66,
    englishTitle: 'Safely Through Another Week',
    author: 'John Newton (1725–1807)',
    stanzas: [
      {
        number: '1.',
        text: 'Safely through another week\nGod has brought us on our way;\nLet us now a blessing seek,\nWaiting in His courts today;\nDay of all the week the best,\nEmblem of eternal rest.',
      },
      {
        number: '2.',
        text: 'Mercies multiplied each hour\nThrough the week our praise demand;\nGuarded by Almighty pow’r,\nFed and guided by His hand;\nThough ungrateful we have been,\nOnly made returns of sin.',
      },
      {
        number: '3.',
        text: 'While we pray for pard’ning grace,\nThrough the dear Redeemer’s Name,\nShow Thy reconciled face,\nTake away our sin and shame;\nFrom our worldly cares set free,\nMay we rest this day in Thee.',
      },
    ],
  },

  // Hymn 91: K&S 45
  91: {
    hymnId: 91,
    englishTitle: 'I Need Thee Every Hour',
    author: 'Annie S. Hawks (1835–1918)',
    stanzas: [
      {
        number: '1.',
        text: 'I need Thee every hour, most gracious Lord;\nNo tender voice like Thine can peace afford.',
        chorus: 'Refrain:\tI need Thee, O I need Thee;\n\t\t\t\tEvery hour I need Thee;\n\t\t\t\tO bless me now, my Saviour,\n\t\t\t\tI come to Thee.',
      },
      {
        number: '2.',
        text: 'I need Thee every hour, stay Thou nearby;\nTemptations lose their pow’r when Thou art nigh.',
      },
      {
        number: '3.',
        text: 'I need Thee every hour, in joy or pain;\nCome quickly and abide, or life is vain.',
      },
      {
        number: '4.',
        text: 'I need Thee every hour, Most Holy One;\nO make me Thine indeed, Thou blessed Son.',
      },
    ],
  },

  // Hymn 105: K&S 59
  105: {
    hymnId: 105,
    englishTitle: 'Redeemed, How I Love to Proclaim It',
    author: 'Fanny Crosby (1820–1915)',
    stanzas: [
      {
        number: '1.',
        text: 'Redeemed, how I love to proclaim it!\nRedeemed by the blood of the Lamb;\nRedeemed through His infinite mercy,\nHis child, and forever, I am.',
        chorus: 'Refrain:\tRedeemed, redeemed,\n\t\t\t\tRedeemed by the blood of the Lamb;\n\t\t\t\tRedeemed, redeemed,\n\t\t\t\tHis child, and forever, I am.',
      },
      {
        number: '2.',
        text: 'Redeemed, and so happy in Jesus,\nNo language my rapture can tell;\nI know that the light of His presence\nWith me doth continually dwell.',
      },
      {
        number: '3.',
        text: 'I think of my blessed Redeemer,\nI think of Him all the day long;\nI sing, for I cannot be silent;\nHis love is the theme of my song.',
      },
    ],
  },

  // Hymn 127: K&S 81
  127: {
    hymnId: 127,
    englishTitle: 'Rejoice, the Lord is King',
    author: 'Charles Wesley (1707–1788)',
    stanzas: [
      {
        number: '1.',
        text: 'Rejoice, the Lord is King!\nYour Lord and King adore;\nMortals, give thanks, and sing,\nAnd triumph evermore.',
        chorus: 'Refrain:\tLift up your heart, lift up your voice;\n\t\t\t\tRejoice, again I say, rejoice!',
      },
      {
        number: '2.',
        text: 'Jesus the Saviour reigns,\nThe God of truth and love;\nWhen He had purged our stains,\nHe took His seat above.',
      },
      {
        number: '3.',
        text: 'His Kingdom cannot fail;\nHe rules o’er earth and Heav’n;\nThe keys of death and hell\nAre to our Jesus giv’n.',
      },
    ],
  },

  // Hymn 245: K&S 199
  245: {
    hymnId: 245,
    englishTitle: 'Christians, Awake, Salute the Happy Morn',
    author: 'John Byrom (1692–1763)',
    stanzas: [
      {
        number: '1.',
        text: 'Christians, awake, salute the happy morn,\nWhereon the Saviour of the world was born;\nRise to adore the mystery of love,\nWhich hosts of angels chanted from above;\nWith them the joyful tidings first begun\nOf God Incarnate and the Virgin’s Son.',
      },
      {
        number: '2.',
        text: 'Then to the watchful shepherds it was told,\nWho heard the angelic herald’s voice: “Behold,\nI bring good tidings of a Saviour’s birth\nTo you and all the nations upon earth:\nThis day hath God fulfilled His promised word,\nThis day is born a Saviour, Christ the Lord.”',
      },
    ],
  },

  // Hymn 344: K&S 298
  344: {
    hymnId: 344,
    englishTitle: 'Sweet Hour of Prayer',
    author: 'William W. Walford (1772–1850)',
    stanzas: [
      {
        number: '1.',
        text: 'Sweet hour of prayer! sweet hour of prayer!\nThat calls me from a world of care,\nAnd bids me at my Father’s throne\nMake all my wants and wishes known.\nIn seasons of distress and grief,\nMy soul has often found relief,\nAnd oft escaped the tempter’s snare,\nBy thy return, sweet hour of prayer!',
      },
      {
        number: '2.',
        text: 'Sweet hour of prayer! sweet hour of prayer!\nThy wings shall my petition bear\nTo Him Whose truth and faithfulness\nEngage the waiting soul to bless.\nAnd since He bids me seek His face,\nBelieve His Word and trust His grace,\nI’ll cast on Him my every care,\nAnd wait for thee, sweet hour of prayer!',
      },
    ],
  },

  // Hymn 442: K&S 396
  442: {
    hymnId: 442,
    englishTitle: 'Holy Bible, Book Divine',
    author: 'John Burton (1773–1822)',
    stanzas: [
      {
        number: '1.',
        text: 'Holy Bible, Book divine,\nPrecious treasure, thou art mine;\nMine to tell me whence I came;\nMine to teach me what I am.',
      },
      {
        number: '2.',
        text: 'Mine to chide me when I rove;\nMine to show a Saviour’s love;\nMine art thou to guide my feet;\nMine to judge, condemn, acquit.',
      },
      {
        number: '3.',
        text: 'Mine to comfort in distress,\nSuff’ring in this wilderness;\nMine to show by living faith\nMan can triumph over death.',
      },
    ],
  },

  // Hymn 482: K&S 436
  482: {
    hymnId: 482,
    englishTitle: 'All to Jesus I Surrender',
    author: 'Judson W. Van DeVenter (1855–1939)',
    stanzas: [
      {
        number: '1.',
        text: 'All to Jesus I surrender,\nAll to Him I freely give;\nI will ever love and trust Him,\nIn His presence daily live.',
        chorus: 'Refrain:\tI surrender all, I surrender all;\n\t\t\t\tAll to Thee, my blessed Saviour,\n\t\t\t\tI surrender all.',
      },
      {
        number: '2.',
        text: 'All to Jesus I surrender,\nHumbly at His feet I bow;\nWorldly pleasures all forsaken,\nTake me, Jesus, take me now.',
      },
      {
        number: '3.',
        text: 'All to Jesus I surrender,\nLord, I give myself to Thee;\nFill me with Thy love and power,\nLet Thy blessing fall on me.',
      },
    ],
  },

  // Hymn 520: K&S 474
  520: {
    hymnId: 520,
    englishTitle: 'Under the Shadow of Thy Wings',
    author: 'Fanny Crosby (1820–1915)',
    stanzas: [
      {
        number: '1.',
        text: 'Under the shadow of Thy wings,\nO Lord, my soul shall rest;\nSafe from the storms of earthly life,\nUpon Thy loving breast.',
      },
      {
        number: '2.',
        text: 'Though foes surround on every hand,\nAnd earthly help be gone,\nThy mighty arm upholds me still,\nAnd leads me safely on.',
      },
    ],
  },

  // Hymn 600: K&S 554
  600: {
    hymnId: 600,
    englishTitle: 'Jesus, Still Lead On',
    author: 'Count Nicolaus von Zinzendorf (1700–1760)',
    stanzas: [
      {
        number: '1.',
        text: 'Jesus, still lead on,\nTill our rest be won;\nAnd, although the way be cheerless,\nWe will follow calm and fearless:\nGuide us by Thy hand\nTo our Fatherland.',
      },
      {
        number: '2.',
        text: 'If the way be drear,\nIf the foe be near,\nLet not faithless fears o’ertake us,\nLet not faith and hope forsake us;\nFor through many a woe\nTo our home we go.',
      },
    ],
  },

  // Hymn 821: K&S 774
  821: {
    hymnId: 821,
    englishTitle: 'Lord, Dismiss Us with Thy Blessing',
    author: 'John Fawcett (1740–1817)',
    stanzas: [
      {
        number: '1.',
        text: 'Lord, dismiss us with Thy blessing;\nFill our hearts with joy and peace;\nLet us each, Thy love possessing,\nTriumph in redeeming grace:\nO refresh us, O refresh us,\nTrav’ling through this wilderness.',
      },
      {
        number: '2.',
        text: 'Thanks we give and adoration\nFor Thy Gospel’s joyful sound;\nMay the fruits of Thy salvation\nIn our hearts and lives abound;\nEver faithful, ever faithful\nTo the truth may we be found.',
      },
    ],
  },
};

export const getEnglishHymn = (hymnId: number): EnglishHymn | null => {
  return ENGLISH_HYMNS[hymnId] || null;
};
