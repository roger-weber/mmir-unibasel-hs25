# mmir-unibasel-hs25
MMIR Scripts, Examples, and Demos

PPT export with w=2800

```
pip install -e git+https://github.com/OscarPellicer/python-pptx.git#egg=python-pptx
pip install -e git+https://github.com/OscarPellicer/pptx2marp.git#egg=pptx2md 

pptx2md 01_Introduction.pptx --marp 

for file in *.png; do echo "Trimming $file..."; magick "$file" -trim -transparent white "$file"; done

for file in Slide*.png; do
  if [[ $file =~ Slide([0-9]+)\.png ]]; then
    number="${BASH_REMATCH[1]}"
    mv "$file" "figure-${number}.png"
    echo "Renamed $file to figure-${number}.png"
  fi
done

```