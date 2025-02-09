import CustomButton from "../components/customButton/CustomButton";

const Home = () => {

  return (
    <>
      <div
        id="container"
        className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 text-gray-900">
        <h1
          className="text-4xl font-extrabold sm:text-5xl md:text-6xl text-gray-900">
          <span className="block">WOW Tournament</span>
          <span
            className="block text-primary-600">
            Organisez, Gagnez, Dominez
          </span>
        </h1>
        <p
          className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl text-gray-500">
          Gérez vos tournois World of Warcraft avec facilité. Créez vos équipes,
          inscrivez vos personnages et affrontez les meilleurs joueurs.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <a id="get_started" href="/characters">
              <CustomButton className="px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition-all focus:ring-4 focus:ring-blue-300 hover:cursor-pointer">Commencer</CustomButton>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
