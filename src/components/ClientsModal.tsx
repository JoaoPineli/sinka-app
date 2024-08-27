import { Modal, Table, TableTd, TableTh, TableThead, TableTr } from "@mantine/core"
import { Client } from "../types";

interface ClientsModalProps {
    open: boolean;
    onClose: () => void;
    clients: Client[];
}

function ClientsModal( { open, onClose, clients }: ClientsModalProps) {
    const formattedClients = clients.map((client) => {
        return {
            ...client,
            birthdate: new Date(client.birthdate).toLocaleDateString(),
            created_at: new Date(client.created_at).toLocaleDateString(),
        }})
    return (
        <Modal
            opened={open}
            title="Clientes"
            size="xl"
            withCloseButton
            onClose={() => onClose()}
        >
            <div>
                <Table>
                    <TableThead>
                        <TableTr>
                            <TableTh>Nome</TableTh>
                            <TableTh>Data de Nascimento</TableTh>
                            <TableTh>Valor</TableTh>
                            <TableTh>Email</TableTh>
                            <TableTh>Data de Criação</TableTh>
                            
                        </TableTr>
                    </TableThead>
                    <tbody>
                        {formattedClients.map((client) => (
                            <TableTr key={client.id}>
                                <TableTd>{client.name}</TableTd>
                                <TableTd>{client.birthdate}</TableTd>
                                <TableTd className="text-end">{client.value}</TableTd>
                                <TableTd>{client.email}</TableTd>
                                <TableTd>{client.created_at}</TableTd>
                            </TableTr>
                        ))}
                    </tbody>
                </Table>
            </div>
    
        </Modal>
  )
}

export default ClientsModal