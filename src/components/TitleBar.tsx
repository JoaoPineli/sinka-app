import { Button } from "@mantine/core"
import { NavLink } from "react-router-dom"

interface TitleBarProps {
    redistributeClients?: () => void
    exportToCSV?: () => void
    returnHome?: boolean 
}  

function TitleBar({redistributeClients, exportToCSV, returnHome = false}: TitleBarProps) {
  return (
    <div className="admin-title">
        { !returnHome && <>
        <NavLink to='/operators'>
         <Button
          className='title-btn' 
          color='blue'
          >
            Visualizar operadores
          </Button> 
        </NavLink>
        <Button
        className='title-btn' 
        color='blue'
        onClick={() => redistributeClients && redistributeClients()}
        >
          Redistribuir clientes
        </Button>
        <Button
        className="title-btn"
        color='blue'
        onClick={() => exportToCSV && exportToCSV()}
        >
          Exportar para CSV
        </Button>
        </> 
        } 
        { returnHome && 
        <NavLink to='/'>
        <Button
        className='title-btn'
        color='blue'
        >
            Pagina Inicial
        </Button> 
          </NavLink>
        }
    </div>
  )
}

export default TitleBar