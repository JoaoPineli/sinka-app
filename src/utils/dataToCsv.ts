interface DataRow {
    [key: string]: string;
}

export function dataToCsv(headers: string[], data: DataRow[], filename: string): void {
    const csv: string = [
        headers.join(','),
        ...data.map((row: DataRow) =>
            headers.map((header: string) => {
                const value: string = row[String(header).toLowerCase()];
                if (header === 'Nascimento') {
                    const dateParts: string[] = value.split('T')[0].split('-');
                    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                }
                return value;
            }).join(',')
        )].join('\n');

    const csvWithBom: string = '\uFEFF' + csv; // BOM para forçar o Excel a abrir o arquivo com a codificação correta
    const blob: Blob = new Blob([csvWithBom], { type: 'text/csv' });
    const url: string = window.URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}
