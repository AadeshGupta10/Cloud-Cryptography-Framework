import { Button } from "@mui/material"

const Home = () => {
    return (
        <div className="container px-3 py-6 flex flex-col gap-3 justify-center text-center">
            <p className="text-xl md:text-4xl font-semibold tracking-wider text-sky-800">
                Cloud Cryptography Framework
            </p>

            <p className="text-lg text-sky-800">
                Kindly fill the Google Form by scanning the QR or by clicking the below button.
            </p>

            <img
                src="/QRCode.png"
                alt="Cloud Cryptography Framework Google Form QR Code"
                className="size-56 mx-auto"
            />

            <a href="https://aadesh-trimrr.vercel.app/cloud-cryptography-framework">
                <Button variant="contained" className="w-fit mx-auto">
                    Visit the Form
                </Button>
            </a>
        </div>
    )
}

export default Home