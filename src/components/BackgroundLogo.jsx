import logo from '../assets/logo.png';

const BackgroundLogo = () => {
    return (
            <img
                src={logo}
                alt="Logo"
                className="fixed align-self-center opacity-10 w-1/2 max-w-lg"
            />
    );
};

export default BackgroundLogo;