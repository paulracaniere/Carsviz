DDIR	= data
LINK	:= https://perso.telecom-paristech.fr/eagan/class/igr204/data/cars.csv
TARGET	=  $(DDIR)/processed_cars.csv
RM	:= rm -fr

install: $(TARGET)

run: $(TARGET)
	python -m SimpleHTTPServer 8000

$(TARGET): $(DDIR)/cars.csv
	cd python && python script.py

$(DDIR)/cars.csv: | $(DDIR)
	curl $(LINK) > $@

$(DDIR):
	mkdir $@

clean:
	$(RM) $(DDIR)
