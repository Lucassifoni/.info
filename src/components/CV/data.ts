const short_tags = {
    elixir: "Elixir",
    wip: ["En cours", "WIP"],
    vue: "Vue",
    typescript: 'Typescript',
    ovo2: 'ovo2',
    maintain: ["Maintenance / Extension", "Improvements & extension"],
    w2p: ["Automatisation", "Automation"],
    etl: "ETL",
    nuxt: "Vue / Nuxt",
    node: "Node",
    laravel: "Laravel",
    wp: "Wordpress",
    rust: "Rust",
    php: "PHP",
    iot: `Raspi + Arduino + Camera`
};

export const tags = Object.entries(short_tags).reduce((out, [key, value]) => {
    if (typeof value === "string") {
        out[key] = { key, value: { fr: value, en: value } };
    } else if (Array.isArray(value) && value.length === 2) {
        out[key] = { key, value: { fr: value[0], en: value[1] } };
    }
    return out;
}, {} as Record<string, { key: string, value: { fr: string, en: string } }>);

export const data = {
    fr: {
        intro: `Je développe et gère des projets d'outils numériques et logiciels sur-mesure <span class="noprint">en indépendant</span> depuis 2015.`,
        other_lang: 'read this page in english',
        titles: {
            collab: `Collaborations & équipes`,
            projects: `Projets choisis`,
            tech: "Technologies",
            form: "Formation",
            oss: "Open-Source",
            stars: "Vers les étoiles",
        },
        collabs: [
            {
                start: 2023,
                end: "présent",
                main: `<a href="https://turing-express.fr">Turing-Express</a>`,
                details: `avec <a href="https://laurasavignac.com">Laura Savignac</a>, développement d'outils d'automatisation du design`,
            },
            {
                start: 2020,
                end: "présent",
                main: `autour du SIGL libre <a href="https://abelujo.cc">Abelujo</a>`,
                details: `avec P. Singer et V. Dardel, augmentation des capacités web du logiciel`,
            },
            {
                start: 2018,
                end: 2022,
                main: `avec l'<a href="https://documents.design">Atelier Documents</a>`,
                details: `gestion, conception et développement de projets web & outils internes`,
            }
        ],
        projects: [
            {
                year: 2023, content: [
                    {
                        intro: `pour l'agence d'architecture <strong>Séquences</strong>, une base de données métier assortie d'outils de recherche, manipulation et incarnation de données (texte, image, modèles 3D, fichiers BIM).`,
                        tags: [tags.elixir, tags.typescript, tags.wip, tags.w2p],
                    },
                    {
                        intro: `pour <strong>Tikoam</strong>, élimination de l'usage d'inDesign par une application web de design, croisement, et recherche de documents.`,
                        tags: [tags.elixir, tags.wip, tags.vue, tags.w2p],
                    },
                    {
                        intro: `pour <strong>Duffau & Associés</strong>, outil de mise en page & composition accélérée de documents, génération de plans de découpe.`,
                        tags: [tags.vue, tags.elixir,tags.w2p, tags.wip]
                    }, {
                        intro: `<strong>Audioskop</strong>, (<a href="https://audioskop.fr">https://audioskop.fr</a>), webapp libre &
                    open-source d'exploration de corpus audio avec A. Delinotte et L. Savignac.
                    `,
                        tags: [tags.elixir, tags.vue]
                    },
                ]
            },
            {
                year: 2022, content: [
                    {
                        intro: `<strong>&lt;sans titre&gt;</strong>, un système no-code/low-code d'automatisation du design, permettant des documents automatisés via API générée à la volée, ou semi-automatisés avec intervention humaine. <br>Avec <strong>ovo2</strong>, un langage maison pour ce projet.`,
                        tags: [tags.elixir, tags.typescript, tags.ovo2, tags.wip],
                    },
                    {
                        intro: `<strong>AbjProxy & Xyver</strong>, monitoring, indexation, proxy API, gestion à distance de fonctions web de plusieurs instances du logiciel Abelujo. `,
                        tags: [tags.elixir, tags.wip, tags.vue],
                    },
                    {
                        intro: `pour <strong>AMM</strong>, outil de mise en page & composition accélérée de documents d'appel d'offre pour
                    l'agence d'architecture.`,
                        tags: [tags.vue, tags.elixir, tags.maintain, tags.w2p]
                    },
                ]
            },
            {
                year: 2021, content: [
                    {
                        intro: `pour <strong>Execo</strong>, outil de génération semi-automatique de dossiers d'appel d'offre
                pour cette agence d'économie de la construction.`,
                        tags: [tags.vue, tags.elixir, tags.w2p],
                    },
                    {
                        intro: `pour <strong>Scalène</strong>, site web stateless puisant ses données d'un ERP développé pour l'agence
                en 2019.`,
                        tags: [tags.vue, tags.elixir],
                    }
                ]
            },
            {
                year: 2020, content: [
                    {
                        intro: `pour le <strong>Musée des Tissus de Lyon</strong>, gestion du projet de constitution d'une base de données
                normalisée avec les équipes, design & développement back-office, réimplémentation du site web à l'origine
                sous Wordpress.`,
                        tags: [tags.vue, tags.elixir, tags.etl],
                    }
                ]
            },
            {
                year: 2019, content: [
                    {
                        intro: `pour l'<strong>Orchestre National d'Île-de-France</strong>, développement d'une API privée & publique, design & développement back-office et outils de gestion internes, par dessus la base de donnée historique de l'institution (15 ans).`,
                        tags: [tags.nuxt, tags.node, tags.laravel],
                    },
                    {
                        intro: `pour le <strong>Musée des Tissus de Lyon</strong>, développement du site web, gateway API unifiant des
                fournisseurs tiers, billetterie temps-réel avec yield management et utilitaire de scan de billets.`,
                        tags: [tags.vue, tags.elixir, tags.wp]
                    },
                    {
                        intro: `pour <strong>Scalène</strong>, conception et développement d'un ERP modélisant les process administratifs
                de l'agence, ses données historiques, outils automatisant des sorties de supports métier, et API consommée
                par d'autres outils.`,
                        tags: [tags.laravel, tags.etl, tags.vue, tags.w2p],
                    },
                ]
            },
            {
                year: 2018, content: [
                    {
                        intro: `pour <strong>lab212</strong>, site web multi-tenant / multi-site reprenant l'historique du travail du
                collectif. Design & développement back-office, outils de production de documents normalisés.`,
                        tags: [
                            tags.laravel, tags.nuxt, tags.node, tags.w2p, tags.rust
                        ]
                    }
                ]
            },
            {
                year: 2016, content: [
                    {
                        intro: `pour <strong>A+B, designers</strong>, site web incluant une caméra allSky, outil d'automatisation de
            dossiers allant de 3 à 300 pages et aux compositions et contenus variés`,
                        tags: [
                            tags.php, tags.iot, tags.w2p
                        ]
                    },
                    {
                        intro: `pour <strong>l'Heure du Brunch</strong>, site web + flux de commandes, design back-office mobile et
                gestion du site en déplacement via un chatbot SMS liant API twilio et API du site.`,
                        tags: [
                            tags.laravel, tags.node, tags.vue,
                        ]
                    }
                ]
            },
            {
                year: 2015, content: [
                    {
                        intro: `pour <strong>AMM</strong>, site web générant des documents administratifs à la volée.`,
                        tags: [
                            tags.php, tags.w2p,
                        ],
                    }
                ]
            }
        ],
        tech: {
            current_stack: `Stack actuelle :`,
            stack: [
                `Backend, domaine métier : Elixir (+ Phoenix)`,
                `Rust (interop. Elixir)`,
                `Frontend & UIs : Typescript (+ Vue.js)`,
                `Data : ETS, sqlite3, PostgreSQL selon besoins`,
                `CI/CD : Github Actions ou Gitlab CI + Docker`,
                `Infra : VPSs debian`,
            ]
        },
        teaching: {
            title: 'Enseignement',
            text: 'En 2017 puis 2018, j\'anime un workshop de 40 heures auprès d\'étudiantes en design. Le cours donne les bases de HTML, CSS et JS.<br>Chaque étudiante pense, code et déploie son site personnel sur Github Pages.'
        },
        formation: [
            {
                start: 2013,
                end: 2015,
                title: 'DSAA Design Graphique',
                details: `Diplôme : système de veille et d’ingestion automatisée d'articles de presse, logiciel d’édition de revues.`
            },
            {
                start: 2011,
                end: 2013,
                title: 'BTS Design Graphique',
                details: `Diplôme : conception d’interfaces de navigation gestuelles pour consulter la presse Française.`
            },
            {
                start: 2008,
                end: 2010,
                title: 'Bac Génie Électronique',
                details: `Conception d'un système d'orientation de panneaux solaires pour van, programmation de
                microcontrolleurs.`
            },
            {
                start: 2007,
                end: "∞",
                title: "Formation à l'informatique",
                details: `Informatique théorique, langages de programmation, sans relâche depuis ma rencontre avec Linux en 2007.`,
            }
        ],
        oss: {
            title: `Mise à disposition open-source de librairies (licence MIT) développées pour certains projets`,
            list: [
                `<a href="https://github.com/documents-org/morris">morris</a>, normalisation de texte sur le web.`,
                `<a href="https://github.com/documents-org/to_pdf">to_pdf</a>, serveur d'impression multi-moteur`,
                `<a href="https://github.com/documents-org/buche">buche</a>, éditeur de blocs récursif pour Vue.js`,
                `<a href="https://github.com/Lucassifoni/imago">imago</a>, fingerprinting d'image en Elixir + Rust`,
            ]
        },

    },
    en: {
        intro: `I build and manage web & internal tooling projects as a freelancer since 2015.`,
        other_lang: 'lire cette page en français',
        titles: {
            collab: `Teams & collaborations`,
            projects: `A few chosen projects`,
            tech: "Technologies",
            form: "Formation",
            oss: "Open-Source",
            stars: "To the stars",
        },
        collabs: [
            {
                start: 2023,
                end: "now",
                main: `<a href="https://turing-express.fr">Turing-Express</a>`,
                details: `with <a href="https://laurasavignac.com">Laura Savignac</a>, design automation applications development`,
            },
            {
                start: 2020,
                end: "now",
                main: `around the FLOSS library management software <a href="https://abelujo.cc">Abelujo</a>`,
                details: `with P. Singer et V. Dardel, expansion of web capabilities of the software`,
            },
            {
                start: 2018,
                end: 2022,
                main: `with the <a href="https://documents.design">Documents</a> design practice`,
                details: `management, design and development of web & tooling projects`,
            },
        ],
        projects: [
            {
                year: 2023, content: [
                    {
                        intro: `for the architecture agency <strong>Séquences</strong>, a business database with search tools, manipulation and data incarnation (text, image, 3D models, BIM files).`,
                        tags: [tags.elixir, tags.typescript, tags.wip, tags.w2p],
                    },
                    {
                        intro: `for <strong>Tikoam</strong>, elimination of the use of inDesign by a web application of design, cross-referencing, and document search.`,
                        tags: [tags.elixir, tags.wip, tags.vue, tags.w2p],
                    },
                    {
                        intro: `for <strong>Duffau & Associés</strong>, layout tool & accelerated document composition, generation of cutting plans.`,
                        tags: [tags.vue, tags.elixir,tags.w2p, tags.wip]
                    },{
                        intro: `<strong>Audioskop</strong>, (<a href="https://audioskop.fr">https://audioskop.fr</a>), FLOSS web app to explore podcast/audio corpuses, with A. Delinotte et L. Savignac.
                    `,
                        tags: [tags.elixir, tags.wip, tags.vue]
                    },
                ]
            },
            {
                year: 2022, content: [
                    {
                        intro: `<strong>&lt;to be named&gt;</strong>, a no-code/low-code design automation system providing automated documents via design APIs & semi-automated documents with human intervention.<br>With <strong>ovo2</strong>, a homebrew language for this project.`,
                        tags: [tags.elixir, tags.typescript, tags.ovo2, tags.wip],
                    },
                    {
                        intro: `<strong>AbjProxy & Xyver</strong>, monitoring, indexation, API proxy, and remote-control of web tasks around Abelujo. `,
                        tags: [tags.elixir, tags.wip, tags.vue],
                    },
                    {
                        intro: `for <strong>AMM</strong>, quick and semi-automated layout engine for administrative / call for offers documents for the architecture agency.
                        `,
                        tags: [tags.vue, tags.elixir, tags.maintain, tags.w2p]
                    }
                ]
            },
            {
                year: 2021, content: [
                    {
                        intro: `for <strong>Execo</strong>, semi-automated layout and public offers documents generation engine, for this architecture economists agency`,
                        tags: [tags.vue, tags.elixir, tags.w2p],
                    },
                    {
                        intro: `for <strong>Scalène</strong>, stateless website consuming the API of their ERP developed in 2019.`,
                        tags: [tags.vue, tags.elixir],
                    }
                ]
            },
            {
                year: 2020, content: [
                    {
                        intro: `for the <strong>Musée des Tissus de Lyon</strong>, design with their team & development of a normalized database & back-office, development of their website with this new data source & layout engine.`,
                        tags: [tags.vue, tags.elixir, tags.etl],
                    }
                ]
            },
            {
                year: 2019, content: [
                    {
                        intro: `for the <strong>Orchestre National d'Île-de-France</strong>, public & private API development, internal tooling, custom back-office for some business tasks, based on their historical database.`,
                        tags: [tags.nuxt, tags.node, tags.laravel],
                    },
                    {
                        intro: `for the <strong>Musée des Tissus de Lyon</strong>, website, API gateway unifying third-party suppliers, access control & ticketing system`,
                        tags: [tags.vue, tags.elixir, tags.wp]
                    },
                    {
                        intro: `for <strong>Scalène</strong>, design & development of a business database, centralising the agency's work into a single repository, consumed by mini-apps and export engines for various business tasks`,
                        tags: [tags.laravel, tags.etl, tags.vue, tags.w2p],
                    },
                ]
            },
            {
                year: 2018, content: [
                    {
                        intro: `for <strong>lab212</strong>, multi-tenant website, single back-office generating 1 to N custom websites.`,
                        tags: [
                            tags.laravel, tags.nuxt, tags.node, tags.w2p, tags.rust
                        ]
                    }
                ]
            },
            {
                year: 2016, content: [
                    {
                        intro: `for <strong>A+B, designers</strong>, website featuring an all-sky camera, book publishing & layout automation engine for documents ranging from 3 to 300 pages.`,
                        tags: [
                            tags.php, tags.iot, tags.w2p
                        ]
                    },
                    {
                        intro: `for <strong>l'Heure du Brunch</strong>, website + order flow, design & development of a remote-controllable backend via a custom SMS chatbot, allowing the owner to voice manage her website on the run.`,
                        tags: [
                            tags.laravel, tags.node, tags.vue,
                        ]
                    }
                ]
            },
            {
                year: 2015, content: [
                    {
                        intro: `for <strong>AMM</strong>, website with on-the-fly administrative documents generation`,
                        tags: [
                            tags.php, tags.w2p,
                        ],
                    }
                ]
            }
        ],
        tech: {
            current_stack: `Current stack in a professionnal context :`,
            stack: [
                `Backend, business domain : Elixir (+ Phoenix)`,
                `Frontend & UIs : Typescript (+ Vue.js)`,
                `Data : ETS, sqlite3, PostgreSQL acc. to needs`,
                `CI/CD : Github Actions / Gitlab CI + Docker`,
                `Infra : VPSs debian`,
            ],
            desired_stack: `Currently learning :`,
            desired_stack_items: [
                `Haskell (would love to use it more)`,
                `Rust (nice Elixir interop.)`,
            ]
        },
        teaching: {
            title: 'Teaching',
            text: 'In 2017 and 2018, I gave a 40h workshop to design students, teaching HTML, CSS & JS basics.<br>Each student has thought, coded, and deployed and code their personal website.'
        },
        formation: [
            {
                start: 2013,
                end: 2015,
                title: 'DSAA Design Graphique',
                details: `Diploma : Automated ingestion of french press releases, automated layout & publishing system based on this data.`
            },
            {
                start: 2011,
                end: 2013,
                title: 'BTS Design Graphique',
                details: `Diploma : gesture-based navigation interfaces to sift through french press releases.`
            },
            {
                start: 2008,
                end: 2010,
                title: 'Bac Génie Électronique',
                details: `Design & manufacturing of a GPS-based solar panel positioning system.`
            },
            {
                start: 2007,
                end: "∞",
                title: "Computer science self-teaching",
                details: `Theorical CS, programming languages, since I met Linux in 2007.`,
            }
        ],
        oss: {
            title: `Librairies (licence MIT) made for some projects`,
            list: [
                `<a href="https://github.com/documents-org/morris">morris</a>, text cleaning & normalisation`,
                `<a href="https://github.com/documents-org/to_pdf">to_pdf</a>, multi-engine PDF print server`,
                `<a href="https://github.com/documents-org/buche">buche</a>, recursive block editor for Vue.js`,
                `<a href="https://github.com/Lucassifoni/imago">imago</a>, Elixir + Rust image fingerprinting`,
            ]
        },
        stars: `Since 2019, I design & build telescopes and acquired knowledge in optics.<br>
        Interferometry of a commercial telescope mirror, then my refigure of it, telescope CAD and build : <a href="https://github.com/Lucassifoni/hyperbolic-200mm-f3.5-/">hyperbolic-200mm-f3.5- sur github</a>.`,
    },
};