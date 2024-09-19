const string_of_sites = `
https://lab212.org~lab212 (art collective)
https://f-u-l-g-u-r-s.net~denis bernard (research in photography)
https://e-r-w-a-n.be~erwan beauvir (dev.)
https://corentinoyer.fr~corentin noyer (type foundry)
https://salomemacquet.com~salomé macquet (artist & designer)
https://www.inkandswitch.com/~ink and switch (research)
https://omer.mobi~omer pesquer (digital & museography)
`;

const r_sites = string_of_sites.split('\n').filter(s => s.trim()).map((str: string) => {
    let p = str.split('~');
    return {a: p[0], b: p[1]};
});

r_sites.sort((a, b) => {
    return Math.random() < 0.5 ? -1 : 1;
});

export const sites : {url: string, name: string}[] = r_sites.map((a: {a:string, b: string}) => ({url: a.a, name: a.b}));