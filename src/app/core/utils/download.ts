export default function download(data: string, filename: string, blobtype: string,type:string) {
    let file = new Blob([data],{ type: blobtype });
    let a = document.createElement("a"),
            url = URL.createObjectURL(file);
    a.href = url;
    a.download = `${filename}.${type}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}
