import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        VISUALIZINGOPTIMIZATION: "VISUALIZING OPTIMIZATION",
        Chooseacountry: "Choose a country",
        Selectacountry: "Select a country to try out the algorithms.",
        search_country: "Search for a country...",
        welcome_message_1:
          "Explore visual solutions and algorithms for the Traveling Salesman Problem through interactive maps and demonstrations.",
        welcome_message_2:
          "Learn route optimization through hands-on examples and algorithm visualizations.",
        About: "About",
        Contact: "Contact",
        Log_in: "Log in",
        Log_out: "Log out",
        User: "User",
        user: "User",
        how_it_works: "How it works",
        demos_text:
          "Understand the logic behind the algorithms for solving the TSP and their validation.",
        Back: "Previous Step",
        connect_the_cities:
          "Connect the cities to create a circular route! Try zooming in for groups of closer cities.",
        try_it_yourself: "Try it  yourself",
        jump_in: "Jump in!",
        sign_up: "Sign up",
        countries: "Countries",
        algorithms: "Algorithms",
        profile: "Profile",
        choose_algorithm: "Choose algorithm",
        step_1: "Step 1: Choose number of cities",
        step_2: "Step 2: Choose a method",
        step_3_diy: "Step 3: Connect the cities",
        step_3_algorithm: "Step 3: Choose an algorithm",
        number_added: "Number to be added:",
        add_to_map: "Add cities to map",
        nearest_neighbor: "Nearest Neighbor Method",
        greedy: "Greedy Heuristic",
        calculate: "Calculate",
        how_it_works: "How It Works",
        distance: "Distance: ",
        total_distance: "Total Distance ",
        tour_completed: "Tour Completed!",
        read_tutorial: "show tutorial",
        what_is_tsp: "What is the TSP?",
        description_1:
          "The Traveling Salesman Problem is an issue in computer science, the goal of which is to find the shortest circular route through a set of points.",
        where_used: "Where is it used?",
        description_2:
          "The TSP is used in many contexts where an optimal circular route has to be drawn, such as in logistics, manufacturing and robotics.",
        why_relevant: "Why is it relevant?",
        description_3:
          "The TSP has factorial time complexity (O(n!)), meaning computation time grows rapidly as input size increases. Therefore, algorithms are used to find efficient near-optimal solutions instead.",
        skip_button: "Skip",
        time_complexity: "Time Complexity",
        input_size: "Input Size (n)",
        tutorial_s1: "Step 1: Choose a country",
        tutorial_d1:
          "Select a free country to explore, or log in to access any country you like.",
        tutorial_s2: "Step 2: Have a try",
        tutorial_d2:
          "Try drawing the shortest route between cities yourself, or try out some algorithms.",
        tutorial_s3: "Step 3: Explore the algorithms",
        tutorial_d3: "Dive deeper into how the algorithms and heuristics work.",
        validation: "Validation",
        total_edge_weight: "Total Edge Weight",
        time: "Time",
        nearest_neighbor_demo: "Nearest Neighbor",
        two_opt: "2-Opt Method",
        prims: "Prim's Algorithm",
        kruskals: "Kruskal's Algorithm",
        edit_profile: "Edit Profile",
        member_since: "Member since October 2024",
        completed_maps: "Completed Maps",
        average_score: "Average Score",
        favorite_algorithm: "Favorite Algorithm",
        favorite_routes: "Favorite Routes",
        recent_scores: "Recent Scores",
        spain: "Spain",
        score: "Score",
        save: "Save",
        last_played: "Last played:",
        times_played: "Times played:",
        average: "Average:",
        time_taken: "Time Taken",
        show_results: "Show Results",
      },
    },
    es: {
      translation: {
        VISUALIZINGOPTIMIZATION: "VISUALIZANDO OPTIMIZACIÓN",
        Chooseacountry: "Elige un país",
        Selectacountry: "Selecciona un país para probar los algoritmos.",
        search_country: "Busca un país...",
        welcome_message_1:
          "Explora soluciones visuales y algoritmos para el Problema del Viajante a través de mapas y demostraciones interactivas.",
        welcome_message_2:
          "Aprende optimización de rutas mediante ejemplos prácticos y visualizaciones de algoritmos.",
        About: "Sobre",
        Contact: "Contacto",
        Log_in: "Iniciar sesión",
        Log_out: "Cerrar sesión",
        User: "Usuario",
        user: "Usuario",
        how_it_works: "Cómo funciona",
        demos_text:
          "Entiende la lógica detrás de los algoritmos para resolver el TSP y su validación.",
        Back: "Paso Anterior",
        connect_the_cities:
          "Conecta las ciudades para crear una ruta circular. Consejo: las ciudades pasan al fondo al hacer clic, así que no tienes que hacer zoom cada vez.",
        try_it_yourself: "Inténtalo tú mismo",
        jump_in: "¡Entra y explora!",
        sign_up: "Regístrate",
        countries: "Países",
        algorithms: "Algoritmos",
        profile: "Perfil",
        choose_algorithm: "Elige un algoritmo",
        step_1: "Paso 1: Elige el número de ciudades",
        step_2: "Paso 2: Elige un método",
        step_3_diy: "Paso 3: Conecta las ciudades",
        step_3_algorithm: "Paso 3: Elige un algoritmo",
        number_added: "Número a agregar:",
        add_to_map: "Agregar ciudades al mapa",
        nearest_neighbor: "Vecino Más Cercano",
        greedy: "Heurística Voraz",
        calculate: "Calcular",
        how_it_works: "Cómo Funciona",
        distance: "Distancia: ",
        total_distance: "Distancia Total",
        tour_completed: "Ruta completada!",
        read_tutorial: "ver tutorial",
        what_is_tsp: "¿Qué es el PDV?",
        description_1:
          "El Problema del Viajante es un problema en ciencias de la computación cuyo objetivo es encontrar la ruta circular más corta a través de un conjunto de puntos.",
        where_used: "¿Dónde se usa?",
        description_2:
          "El PDV se utiliza en muchos contextos donde se necesita trazar una ruta circular óptima, como en logística, fabricación y robótica.",
        why_relevant: "¿Por qué es relevante?",
        description_3:
          "El PDV tiene complejidad temporal factorial (O(n!)), lo que significa que el tiempo de cálculo crece rápidamente a medida que aumenta el tamaño de la entrada. Por eso, se utilizan algoritmos para hallar soluciones eficientes casi óptimas.",
        skip_button: "Saltar",
        time_complexity: "Complejidad Temporal",
        input_size: "Tamaño de Entrada (n)",
        tutorial_s1: "Paso 1: Elige un país",
        tutorial_d1:
          "Selecciona un país gratuito para explorar, o inicia sesión para acceder a cualquier país que desees.",
        tutorial_s2: "Paso 2: Inténtalo",
        tutorial_d2:
          "Intenta dibujar la ruta más corta entre ciudades tú mismo, o prueba algunos algoritmos.",
        tutorial_s3: "Paso 3: Explora los algoritmos",
        tutorial_d3:
          "Profundiza en cómo funcionan los algoritmos y heurísticas.",
        validation: "Validación",
        total_edge_weight: "Peso Total de Aristas",
        time: "Tiempo",
        nearest_neighbor_demo: "Vecino Más Cercano",
        two_opt: "Método 2-Opt",
        prims: "Algoritmo de Prim",
        kruskals: "Algoritmo de Kruskal",
        edit_profile: "Editar Perfil",
        member_since: "Miembro desde octubre de 2024",
        completed_maps: "Mapas Completados",
        average_score: "Puntuación Media",
        favorite_algorithm: "Algoritmo Favorito",
        favorite_routes: "Rutas Favoritas",
        recent_scores: "Puntuaciones Recientes",
        spain: "España",
        score: "Puntuación",
        save: "Guardar",
        last_played: "Última partida:",
        times_played: "Veces jugado:",
        average: "Promedio:",
        time_taken: "Tiempo",
        show_results: "Ver Resultados",
      },
    },
    ca: {
      translation: {
        VISUALIZINGOPTIMIZATION: "VISUALITZANT OPTIMIZACIÓ",
        Chooseacountry: " tria un país",
        Selectacountry: "Selecciona un país per provar els algorismes.",
        search_country: "Busca un país...",
        welcome_message_1:
          "Explora solucions visuals i algoritmes per al Problema del Viatjant mitjançant mapes i demostracions interactives.",
        welcome_message_2:
          "Aprèn optimització de rutes a través d'exemples pràctics i visualitzacions d'algoritmes.",
        About: "Sobre",
        Contact: "Contacte",
        Log_in: "Iniciar sessió",
        Log_out: "Tancar sesió",
        User: "Usuari",
        user: "Usuari",
        how_it_works: "Com funciona",
        demos_text:
          "Entén la lògica darrere dels algorismes per resoldre el PDV i la seva validació.",
        Back: "Pas Anterior",
        connect_the_cities:
          "Connecta les ciutats per crear una ruta circular! Consell: les ciutats van al fons en fer clic, així que no cal fer zoom cada vegada.",
        try_it_yourself: "Prova-ho tu mateix",
        jump_in: "Entra i explora!",
        sign_up: "registra't",
        countries: "Països",
        algorithms: "Algorismes",
        profile: "Perfil",
        choose_algorithm: "Tria un algorisme",
        step_1: "Pas 1: Tria el nombre de ciutats",
        step_2: "Pas 2: Tria un mètode",
        step_3_diy: "Pas 3: Connecta les ciutats",
        step_3_algorithm: "Pas 3: Tria un algorisme",
        number_added: "Número a afegir:",
        add_to_map: "Afegir ciutats al mapa",
        nearest_neighbor: "Mètode del Veí Més Proper",
        greedy: "Heurística Golafre",
        calculate: "Calcular",
        how_it_works: "Com Funciona",
        distance: "Distància: ",
        total_distance: "Distància Total",
        tour_completed: "Ruta completada!",
        read_tutorial: "veure tutorial",
        what_is_tsp: "Què és el PDV?",
        tutorial_s1: "Paso 1: Tria un país",
        description_1:
          "El Problema del Viatjant és un problema en ciències de la computació, on l'objectiu és trobar la ruta circular més curta a través d'un conjunt de punts.",
        where_used: "On s'utilitza?",
        description_2:
          "El PDV s'utilitza en molts contextos on cal traçar una ruta circular òptima, com en logística, fabricació i robòtica.",
        why_relevant: "Per què és rellevant?",
        description_3:
          "El PDV té una complexitat temporal factorial (O(n!)), el que significa que el temps de càlcul creix ràpidament amb l'augment de la mida de l'entrada. Per tant, s'utilitzen algorismes per trobar solucions eficients gairebé òptimes.",
        skip_button: "Omet",
        time_complexity: "Complexitat Temporal",
        input_size: "Mida de l'Entrada (n)",
        tutorial_d1:
          "Selecciona un país gratuït per explorar, o inicia sessió per accedir a qualsevol país que desitgis.",
        tutorial_s2: "Pas 2: Prova-ho",
        tutorial_d2:
          "Intenta dibuixar la ruta més curta entre ciutats tu mateix, o prova alguns algorismes.",
        tutorial_s3: "Pas 3: Explora els algorismes",
        tutorial_d3:
          "Aprofundeix en com funcionen els algorismes i les heurístiques.",
        validation: "Validació",
        total_edge_weight: "Pes Total de Arestes",
        time: "Temps",
        nearest_neighbor_demo: "Veí Més Proper",
        two_opt: "Mètode 2-Opt",
        prims: "Algorisme de Prim",
        kruskals: "Algorisme Kruskal",
        edit_profile: "Editar Perfil",
        member_since: "Membre des d'octubre de 2024",
        completed_maps: "Mapes Completats",
        average_score: "Puntuació Mitjana",
        favorite_algorithm: "Algoritme Preferit",
        favorite_routes: "Rutes Preferides",
        recent_scores: "Puntuacions Recents",
        spain: "Espanya",
        score: "Puntuació",
        save: "Guardar",
        last_played: "Última partida:",
        times_played: "Vegades jugat:",
        average: "Mitjana:",
        time_taken: "Temps",
        show_results: "Veure resultats",
      },
    },
  },
  lng: "es",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
