const $host = document.createElement("pre");
$host.textContent = JSON.stringify(process.versions, null, 2);

document.body.appendChild($host);
