const toSnakeCase = (s: string) => s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join(`_`) || ""

class Copy {
    name: string
    content: string

    constructor(name: string, content: string) {
        this.name = name
        this.content = content
    }
}

const textNodes = figma.currentPage.findAll(node => node.type === 'TEXT') as TextNode[]

const copies = new Array<Copy>();

for (const node of textNodes) {
    const layerName = node.name;
    const layerContent = node.characters;
    copies.push(new Copy(toSnakeCase(layerName), layerContent))
}

const obj = copies
    .sort((a, b) => a.name < b.name ? -1 : 1)
    .reduce((acc, {name, content}) => ({...acc, [name]: content}), {});

fetch('https://figma.digitalhire.net/api/json', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(obj)
}).then(response => {
        if (response.ok) {
            figma.notify("File Successfully Created")
        } else {
            figma.notify("File not Created", {error: true})
        }
    }
).then(data => console.log(data))
    .catch(error => {
        figma.notify(error, {
            error: true, timeout: 5000
        });
        console.error(error);
    })