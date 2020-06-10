import pandas as pd
from sklearn.decomposition import PCA
from sklearn import preprocessing

# Strings for columns in Pandas
engine_specs = ["MPG", "Cylinders", "Displacement", "Horsepower", "Weight", "Acceleration"]

# All possible unique combinations the user might want to process
possibilities = [[0, 1, 2], [0, 1, 3], [0, 1, 4], [0, 1, 5],
                 [0, 2, 3], [0, 2, 4], [0, 2, 5],
                 [0, 3, 4], [0, 3, 5],
                 [0, 4, 5],
                 [1, 2, 3], [1, 2, 4], [1, 2, 5],
                 [1, 3, 4], [1, 3, 5],
                 [1, 4, 5],
                 [2, 3, 4], [2, 3, 5],
                 [2, 4, 5],
                 [3, 4, 5],
                 
                 [0, 1, 2, 3], [0, 1, 2, 4], [0, 1, 2, 5],
                 [0, 1, 3, 4], [0, 1, 3, 5],
                 [0, 1, 4, 5],
                 [0, 2, 3, 4], [0, 2, 3, 5],
                 [0, 2, 4, 5],
                 [0, 3, 4, 5],
                 [1, 2, 3, 4], [1, 2, 3, 5],
                 [1, 2, 4, 5],
                 [1, 3, 4, 5],
                 [2, 3, 4, 5],
                 
                 [0, 1, 2, 3, 4], [0, 1, 2, 3, 5],
                 [0, 1, 2, 4, 5],
                 [0, 1, 3, 4, 5],
                 [0, 2, 3, 4, 5],
                 [1, 2, 3, 4, 5],
                ]

# Reading dataset
print("Reading dataset cars.csv ...")
dataset = pd.read_csv("../data/cars.csv", delimiter=";", skiprows=[1])

# Standardize all attributes
scaled_category = []
for category in engine_specs:
    column = dataset[category]
    column = column[column != 0]
    column = pd.Series(preprocessing.scale(column.values), name=column.name + "_norm", index=column.index)
    scaled_category.append(column)
dataset_scaled = pd.concat(scaled_category, axis=1, sort=False)

pca = PCA(n_components=2)
reduced = []
# Processing for every combination
for possibility in possibilities:
    columns = [engine_specs[i] for i in possibility];
    print("Currently processing PCA for: " + ", ".join(columns))
    subset = dataset[columns]
    condition = (subset[columns[0]] != 0)
    for col in columns[1:]:
        condition &= (subset[col] != 0)
    subset = subset[condition]
    subset = pd.DataFrame(preprocessing.scale(subset.values), columns=subset.columns, index=subset.index)

    # Adding the computed coordinates to the list
    reduced.append(pd.DataFrame(pca.fit_transform(subset), columns=["PC1_" + "".join([str(i) for i in possibility]), "PC2_" + "".join([str(i) for i in possibility])], index=subset.index))

# Concatenating all columns
result = pd.concat([dataset, dataset_scaled] + reduced, axis=1, sort=False)

# Printing the results in a CSV file
result.to_csv("../data/processed_cars.csv", index=False)

