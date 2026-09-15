import pymupdf as fitz
from pathlib import Path
root=Path(__file__).resolve().parents[1]
# Verified PDF pages and figure boundaries, in PDF points. No archaeological object is cropped.
for pdf,page,name,rect in [('kermek',14,'kermek-tools',(70,66,410,527)),('kostenki',15,'lithics',(82,210,536,765)),('kostenki',16,'bone-art',(155,50,435,382))]:
 doc=fitz.open(root/'reference-assets'/f'{pdf}.pdf')
 doc[page].get_pixmap(matrix=fitz.Matrix(3,3),clip=fitz.Rect(*rect)).save(root/'public/assets'/f'{name}.png')
