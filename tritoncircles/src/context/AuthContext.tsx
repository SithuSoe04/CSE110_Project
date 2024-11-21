import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';

interface AuthContextType{
    isAuthenticated: Boolean;
    setIsAuthenticated: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined> (undefined);

export const AuthProvider: React.FC<{ children : React.ReactNode}> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        return storedAuth === 'true';
    });

    useEffect(() => {
        localStorage.setItem('isAuthenticated', String(isAuthenticated));
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be within an AuthProvider');
    }
    return context;
};