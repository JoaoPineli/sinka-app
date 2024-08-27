export function dataToCsv(headers, data, filename: string) {
    const csv = [
        headers.join(','),
        ...data.map(row => headers.map(header => { 
            const value = row[String(header).toLowerCase()];
            if(header === 'Nascimento') {
                const dateParts = value.split('T')[0].split('-');
                return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            }
            return value;
        }).join(','))
    ].join('\n');
    const csvWithBom = '\uFEFF' + csv; // BOM para forçar o Excel a abrir o arquivo com a codificação correta
    const blob = new Blob([csvWithBom], {type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}
