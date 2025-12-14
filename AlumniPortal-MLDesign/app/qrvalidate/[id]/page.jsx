import Form from "../_components/form";

const Page = ({ params }) => {
    return <div><Form id={params.id} /></div>;
};

export default Page;