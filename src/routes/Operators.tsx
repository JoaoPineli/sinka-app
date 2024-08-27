import { Button, Group, Modal, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text } from '@mantine/core'
import '../styles/operators.css'
import '../index.css'
import { useEffect, useMemo, useState } from 'react';
import { del, get, put } from '../api';
import ClientsModal from '../components/ClientsModal';
import { Operator } from '../types';
import EditOperatorModal from '../components/EditOperatorModal';
import { IconEdit, IconX } from '@tabler/icons-react';
import TitleBar from '../components/TitleBar';


function Operators() {
    const [operatorList, setOperatorList] = useState<Operator[]>([]);
    const [clientsModalOpen, setClientsModalOpen] = useState(false);
    const [clients, setClients] = useState([]);

    const [operatorModalOpen, setOperatorModalOpen] = useState(false);
    const [operatorToDelete, setOperatorToDelete] = useState<number>(-1);

    const [operator, setOperator] = useState<Operator>({
        id: 0,
        name: '',
    });

    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
    const closeClientsModal = () => setClientsModalOpen(false);

    useEffect(() => {
    get('operators').then((response) => {
        setOperatorList(response.data);
        }).catch(error => {
            console.log(error);
        }
    )
    }, [])
    const showClients = (operatorId: number) => {
        get(`clients/getByOperator/${operatorId}`).then((response) => {
            setClients(response.data);
            setClientsModalOpen(true);
        }).catch(error => {
            console.log(error)
        })
    }
    const openEditOperatorModal = (operatorId: number) => {
        const operator = operatorList.find(operator => operator.id === operatorId);
        if(!operator) return;
        setOperator(operator);
        setOperatorModalOpen(true);
    }

    const editOperator = (operator: Operator) => {
        put(`operator/${operator.id}`, operator).then(() => {
            setOperatorModalOpen(false);
            get('operators').then((response) => {
                setOperatorList(response.data);
            }).catch(error => {
                console.log(error);
            })
        }).catch(error => {
            console.log(error)
        })
    }
    const deleteOperator = () => {
        del(`operator/${operatorToDelete}`).then(() => {
            get('operators').then((response) => {
                setOperatorList(response.data);
            }).catch(error => {
                console.log(error);
            })
        }).catch(error => {
            console.log(error)
        })
    }

    const openDeleteModal = (operatorId: number) => {
        setOperatorToDelete(operatorId);
        setConfirmDeleteDialog(true);
    }

    const rows = useMemo(() => operatorList.map((operator) => (
        <TableTr key={operator.id}>
            <TableTd className='text-center'>{operator.name}</TableTd>
            <TableTd className='text-center'>{operator.clients_count}</TableTd>
            <TableTd><Button size='xs' className='table-btn-1' onClick={() => showClients(operator.id)}>Clientes</Button></TableTd>
            <TableTd><Button color="green" size='xs' className='table-btn-2' onClick={() => openEditOperatorModal(operator.id)}><IconEdit/></Button></TableTd>
            <TableTd><Button color="red" size='xs' className='table-btn-2' onClick={() => openDeleteModal(operator.id)}><IconX/></Button></TableTd>
        </TableTr>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    )), [operatorList]
    )

  return (
    <>
            <div>
                <Modal 
                opened={confirmDeleteDialog} 
                onClose={() => setConfirmDeleteDialog(false)} 
                withCloseButton={false}
                styles={{
                    content: {
                        border: '2px solid #C92A2A',
                        borderRadius: '8px'
                    }
                }}>
                    <Text size='lg'className='text-center'>Tem certeza que deseja excluir este operador?</Text>
                    <Text size='md' fw={700} className='text-center'>Esta ação não pode ser desfeita.</Text>
                    <Text size='md'className='text-center'>Os clientes deste operador serão redistribuídos.</Text>
                    <Group justify='center' className='mt-2'>
                        <Button color='green' className='w-28' onClick={() => setConfirmDeleteDialog(false)}>Cancelar</Button>
                        <Button color='red' className='w-28' onClick={() => deleteOperator()}>Confirmar</Button>
                    </Group>
                </Modal>
            </div>
        <TitleBar returnHome={true}/>
        <ClientsModal open={clientsModalOpen} onClose={closeClientsModal} clients={clients}/>
        <EditOperatorModal 
        open={operatorModalOpen} 
        onClose={() => setOperatorModalOpen(false)} 
        onEdit={(operator: Operator) => editOperator(operator)}
        operator={operator}/>
        <div className='center-items'>
            <Table className='table-style-1'>
                <TableThead>
                    <TableTr>
                        <TableTh>Nome</TableTh>
                        <TableTh>Qtd. Clientes</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {rows}
                </TableTbody>
            </Table>
        </div>
    </>
  )
}

export default Operators