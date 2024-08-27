import { Button, Group, Notification, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconUpload, IconX, IconFileExcel } from '@tabler/icons-react';
import '../styles/admin.css'
import { Dropzone } from '@mantine/dropzone'
import { useMemo, useState } from 'react';
import { get, post } from '../api';
import TitleBar from '../components/TitleBar';
import { dataToCsv } from '../utils/dataToCsv';

function Home() {
    const [files, setFiles] = useState<File[]>([])
    const fileNames = useMemo(() => files.map(file => file.name), [files]);
    
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        color: '',
        title: ''
    })

    const closeNotification = () => setNotification({
        open: false,
        message: '',
        color: '',
        title: ''
    })

    const handleDrop = (files: File[]) => setFiles(files);
    const handleRemoveFile = (name: string) => setFiles(files.filter(file => file.name !== name));
    const clearFiles = () => setFiles([])
    
    const form = useForm({
        mode: 'controlled',
        initialValues: {
            operatorName: '',
        },
        validate: {
            operatorName: (value) => value.length > 0 ? null : 'Campo obrigatório',
        },
    })

    const addOperator = async () => {
        form.validate();
        if(!form.isValid) return
        try {
            const operatorName = form.values.operatorName
            await post('operator', {name: operatorName}).then(() => {

                setNotification({
                    open: true,
                    title: 'Sucesso',
                    message: `O operador ${operatorName} foi adicionado com sucesso`,
                    color: 'Green'
                })
            }).catch(error => {
                setNotification({
                    open: true,
                    title: 'Erro',
                    message: `Erro ao adicionar o operador ${operatorName}`,
                    color: 'Red'
                })
                console.log(error)
            }).finally(() => {
                setTimeout(() => {
                    closeNotification()
                }, 5000)
            })
        } catch (error) {
            console.log(error)
        }finally{
            form.reset()
        }
    }

    const uploadFiles = async () => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        try {
            await post('clients/csv', formData).then(() => {
                setNotification({
                    open: true,
                    title: 'Sucesso',
                    message: 'Clientes importados com sucesso',
                    color: 'Green'
                })
            }).catch(error => {
                setNotification({
                    open: true,
                    title: 'Erro',
                    message: 'Erro ao importar clientes',
                    color: 'Red'
                })
                console.log(error)
            }).finally(() => {
                setTimeout(() => {
                    closeNotification()
                }, 5000)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const redistributeClients = async () => {
        try {
            await post('clients/redistribute').then(() => {
                setNotification({
                    open: true,
                    title: 'Sucesso',
                    message: 'Clientes redistribuídos com sucesso',
                    color: 'Green'
                })
            }).catch(error => {
                setNotification({
                    open: true,
                    title: 'Erro',
                    message: 'Erro ao redistribuir clientes',
                    color: 'Red'
                })
                console.log(error)
            }).finally(() => {
                setTimeout(() => {
                    closeNotification()
                }, 5000)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const exportToCSV = async () => {
        await get('clients/export').then((response) => {
            const headers = ['Nome', 'Nascimento', 'Valor', 'Email', 'Operador']
            dataToCsv(headers, response.data, 'clientes.csv')
        }).catch(error => {
            console.log(error)
        }
        )
    }

    return (
        <>
            <TitleBar
            redistributeClients={redistributeClients}
            exportToCSV={exportToCSV}
            />
            { notification.open &&
                <Notification 
                    title={notification.title} 
                    color={notification.color} 
                    onClose={closeNotification}
                    className='notification-1'>
                {notification.message}
                </Notification>
            }
            <div className="center-items">
                <form className='form-style-1'>
                    <TextInput
                    label='Nome do operador'
                    placeholder='Nome'
                    key={form.key('operatorName')}
                    {...form.getInputProps('operatorName')}
                    />
                    <div >
                        <Button
                        color='green'
                        className='mt-2 float-right'
                        onClick={() => addOperator()}
                        >Adicionar</Button>
                    </div>
                </form>
                {files.length === 0 && (
                    <div>
                        <Dropzone
                        onDrop={handleDrop}
                        onReject={(files) => console.log('rejected files', files)}
                        accept={['text/csv']}
                        className='dropzone-style-1'
                        >
                            <Group className='pointer-events-none' mih={50}>
                                <Dropzone.Accept>
                                <IconUpload stroke={1.5} />
                                </Dropzone.Accept>
                                <Dropzone.Reject>
                                <IconX stroke={1.5}/>
                                </Dropzone.Reject>
                                <Dropzone.Idle>
                                <IconFileExcel stroke={1.5} />
                                </Dropzone.Idle>
                                <div>
                                <Text inline>
                                    Importar clientes
                                </Text>
                                <Text inline c="dimmed" size='sm'>
                                    (Clique ou arraste)
                                </Text>
                                </div>
                            </Group>
                        </Dropzone>
                    </div>
                )}
                {fileNames.length > 0 && (
                    <div className='upload-files-1 mt-4'>
                            <div>
                                <ul>
                                    {fileNames.map((name, index) => (
                                        <li key={index} className='file-item'>
                                            <span className='mr-4'>{name}</span>
                                            <Button
                                                size='compact-xs'
                                                color='red'
                                                onClick={() => handleRemoveFile(name)}
                                            >
                                                <IconX size={14} />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        <div className='space-x-2'>
                            <Button color='blue' className='mt-2 w-24' onClick={uploadFiles}>Enviar</Button>
                            <Button color='red' className='mt-2 w-24' onClick={clearFiles}>Cancelar</Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Home