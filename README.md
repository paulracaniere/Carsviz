# Cars visualisation project

## TL;DR

This project contains the IGR204 project based on the `cars.csv` dataset. The authors are students from Télécom Paris:

- Mickael Corroyer
- Guillaume Delepoulle
- Julien Eudine
- Thibaud Moutsita
- Paul Racanière

## Download

To clone the project, use the CLI and type:

```bash
git clone https://github.com/paulracaniere/Carsviz.git
```

For memory reasons, the data is not provided in this repository, please download `cars.csv` and put it into a new `data/` directory. It can be downloaded [here](https://perso.telecom-paristech.fr/eagan/class/igr204/data/cars.csv).

## Preprocessing

To obtain the preprocessed `.csv` file, make sure you have the following Python libraries:

- Pandas
- Scikit-learn

and run:

```bash
cd python
python script.py
```

This will generate the `processed_cars.csv` in the `data/` directory.
