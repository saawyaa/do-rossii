"""Download the exact source assets cited in the supplied brief using system TLS."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import subprocess

project = Path(__file__).resolve().parents[1]
root = project / 'reference-assets'
root.mkdir(exist_ok=True)
commons = {
 'cave-real': 'Black_Anui_of_Ust-Kansky_district._Denisova_cave.jpg',
 'denisova-artifacts': 'Denisova_Cave_lithic_and_osseous_artifacts.jpg',
 'burial': 'Twin_burial_model_-_Sungir_-_Vladimir_Palaty.jpg',
 'clothing': 'Clothes_3_-_Sungir_-_Vladimir_Palaty.jpg',
 'spears': 'Spears_1_-_Sungir_-_Vladimir_Palaty.jpg',
 'figurine': 'Figurine_-_Sungir_-_Vladimir_Palaty.jpg',
}
urls = {}
for key, name in commons.items():
 digest = hashlib.md5(name.encode()).hexdigest()
 urls[key + '.jpg'] = f'https://upload.wikimedia.org/wikipedia/commons/{digest[0]}/{digest[:2]}/{name}'
urls.update({
 'stratigraphy.png': 'https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41467-025-60140-6/MediaObjects/41467_2025_60140_Fig2_HTML.png',
 'kermek.pdf': 'https://www.old.archeo.ru/izdaniya-1/pazhmi-pajis/issues/pdf/02Shchelinsky.pdf',
 'kostenki.pdf': 'https://www.old.archeo.ru/struktura-1/otdel-paleolita/pdf/Sinitzun_Hoffecker_Bessudnov_2004.pdf/at_download/file',
 'countries.geojson': 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson',
})
def download(item):
 name,url=item
 subprocess.run(['curl','-fsSL','--retry','2','--connect-timeout','20','--max-time','120',url,'-o',str(root/name)],check=True)
 return name
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for name in pool.map(download,urls.items()):
  print(name,flush=True)
countries=json.loads((root/'countries.geojson').read_text())
russia=next(f for f in countries['features'] if f['properties']['ADMIN']=='Russia')
(project/'src/data/russia.json').write_text(json.dumps(russia))
