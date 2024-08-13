import {FC, useEffect, useState} from "react";
import {useParams} from "react-router-dom";


export const Test: FC = () =>  {

    const {'*': splat} = useParams<{ "*": string }>();

    const [a, setA] = useState("")

    useEffect(() => {
        setA("hello world")
    }, );

    return (
        <h1>
            Hello World {splat} {a}
        </h1>
    )

}