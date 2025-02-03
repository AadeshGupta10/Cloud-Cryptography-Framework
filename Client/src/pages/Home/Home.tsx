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

            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfdv4b5qlOmxYNuMV0tH4dHlMllQpFOd0gN0DBXVikfyZegnQ/viewform"
                className="w-fit mx-auto"
            >
                <Button variant="contained">
                    Visit the Form
                </Button>
            </a>
        </div>
    )
}

export default Home