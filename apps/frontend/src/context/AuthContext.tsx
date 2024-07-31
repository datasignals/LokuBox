import React, {
    createContext, type ReactElement,
    useContext,
} from "react";

interface AuthContextType {
    example: string
}

interface Props {
    children?: ReactElement
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

//TODO maybe also instantiate backend routes here so it can be called by the context?
export const AuthProvider: React.FC<Props> =
    ({children}) => {

        const example = "example";

        return (
            <AuthContext.Provider
                value={{
                    example
                }}
            >
                {children}
            </AuthContext.Provider>
        );
    };

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};
