# Cars visualisation project

## TL;DR

This project contains the IGR204 project based on the `cars.csv` dataset. The authors are students from Télécom Paris:

- Mickael Corroyer
- Guillaume Delepoulle
- Julien Eudine
- Thibaud Moutsita
- Paul Racanière

## Installation

To clone the project, use the CLI and type:

```bash
git clone https://github.com/paulracaniere/Carsviz.git
```

To install the data please install [curl](https://curl.haxx.se/).

To be able to run the preprocessing, please install [pandas](https://pandas.pydata.org/) and also [scikit-learn](https://scikit-learn.org/stable/).

For memory reasons, the data is not provided in this repository. You can find them [here](https://perso.telecom-paristech.fr/eagan/class/igr204/data/cars.csv).

Use the command `make` to install and preprocess the data.

This will generate the `processed_cars.csv` in the `data/` directory.
