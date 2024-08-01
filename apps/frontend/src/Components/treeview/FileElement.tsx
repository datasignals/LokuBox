import type {FC} from "react";

interface Props {
    name: string
}

export const FileElement: FC<Props> = ({name}) => {


    return (
        <>
            <button type="button" key={name}>
                {`🧾${name}`}
            </button>
            <br/>
        </>
    )
}