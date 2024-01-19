import React from "react";
import './ButtonMenu.css'

interface ButtonMenuProps {
    text: string;
    onClick: () => void;
    fontSize?: string;
}

const  ButtonMenu: React.FC<ButtonMenuProps> = ({ text, onClick, fontSize = '16px' }) => {
    const style = {
        fontSize: fontSize
    };
    
    return (
        <div className="button-menu" onClick={onClick} style={style}>
            {text}
        </div>    
    );
}
 
export default ButtonMenu;
