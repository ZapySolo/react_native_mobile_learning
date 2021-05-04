
import React, { useState, createContext, useEffect } from 'react';

export const AppContext = createContext()

export const AppDataProvider = (props) => {
    const [activeUserData, setActiveUserData] = useState(null);

    useEffect(() => {
        
    }, [props.activeUserID])

    const somefunction = async () => {

    }

    return (
        <AppContext.Provider 
            value={[activeUserData, somefunction]}>
            {props.children}
        </AppContext.Provider>
    );
}