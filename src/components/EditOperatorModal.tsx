import { Button, Modal, TextInput } from '@mantine/core'
import { Operator } from '../types';
import { Form, useForm } from '@mantine/form';
import { useEffect } from 'react';
interface EditOperatorModalProps {
    open: boolean;
    onClose: () => void;
    onEdit: (operator: Operator) => void;
    operator: Operator;     
}
    

function EditOperatorModal( { open, onClose, onEdit, operator }: EditOperatorModalProps) {
    const form = useForm({
        initialValues: {
            name: operator.name,
        },
        validate: {
            name: (value) => value.length > 0 ? null : 'Campo obrigatório',
        },
    })

    useEffect(() => {
        if (open && operator) {
            form.setValues({
                name: operator.name,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, operator]);

    const saveOperator = () => {
        const validation =form.validate();
        if(validation.hasErrors) return;
        onEdit({
            ...operator,
            name: form.values.name});
    }

    return (
        <Modal 
            opened={open}
            title="Editar Operador"
            size="md"
            withCloseButton
            onClose={() => onClose()}
        >
            <Form form={form} >
                <TextInput 
                    label="Nome" 
                    placeholder="Nome" 
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                    required />
                <Button 
                type="submit" 
                onClick={saveOperator} 
                className='mt-2 mb-3 float-right'
                color='green'>Salvar</Button>
            </Form>


    </Modal>
  )
}

export default EditOperatorModal