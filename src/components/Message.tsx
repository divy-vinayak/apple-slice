interface MessagePropsType {
    type: string;
    content: string;
}
export default function Message({ type, content }: MessagePropsType) {
    if (type === "user") {
        return <div>
            
        </div>;
    }
    return <div></div>;
}
