import { FC } from 'react'
import { useOutlet } from 'react-router-dom'

const AnimatedOutlet : FC = ()=>{

    const currentOutlet = useOutlet();

    return (
        <>{ currentOutlet }</>
    )
}


export default AnimatedOutlet;