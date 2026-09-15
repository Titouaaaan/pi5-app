export const phd = {
  title:
    "Model-based deep reinforcement learning for drone control with physics-informed priors",
  lab: "ONERA DTIS, Palaiseau, with ISIR at Sorbonne Université",
  dates: "November 2026, three years",
  supervisors: "Julien Marzat and Pierre Fournier (ONERA), Olivier Sigaud (ISIR)",
  project: "ANR HAMMER, PEPR Accélération Robotique",
  summary: [
    "Deep reinforcement learning is increasingly used to control robots, but learning a policy directly on a real platform is still difficult. Exploration can produce unsafe motions, performance is often unstable, and it takes a lot of samples and time. Model-based reinforcement learning uses an explicit model of the system dynamics to predict behaviour and choose actions, which helps with all three. The thesis asks what a physical prior brings to that model.",
    "The first step is to port a neural ODE approach to a fixed-wing drone and compare it with model-based methods that use no prior, such as TD-MPC and PETS. After that come the open problems: long-horizon tasks where the attitude and guidance loops run at different time scales, sparse rewards, partial observability, and generalising across tasks and across drones with parameter uncertainty. Everything is evaluated in simulation, with JSBSim and Flycraft among the tools.",
  ],
} as const;
