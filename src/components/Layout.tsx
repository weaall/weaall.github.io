import Header from "./header/Header"

export function Layout(props: React.PropsWithChildren) {
    return (
        <>
            <Header />
            {props.children}
        </>
    )
}
