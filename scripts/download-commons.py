import hashlib, subprocess, concurrent.futures
from pathlib import Path
files={'cave-real':'Black_Anui_of_Ust-Kansky_district._Denisova_cave.jpg','denisova-artifacts':'Denisova_Cave_lithic_and_osseous_artifacts.jpg','burial':'Twin_burial_model_-_Sungir_-_Vladimir_Palaty.jpg','clothing':'Clothes_3_-_Sungir_-_Vladimir_Palaty.jpg','spears':'Spears_1_-_Sungir_-_Vladimir_Palaty.jpg','figurine':'Figurine_-_Sungir_-_Vladimir_Palaty.jpg'}
def one(item):
 key,name=item;h=hashlib.md5(name.encode()).hexdigest();url=f'https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{name}'
 r=subprocess.run(['curl','-fL','--retry','2','--connect-timeout','20','--max-time','60',url,'-o',f'public/assets/{key}.jpg'],capture_output=True);return key,r.returncode
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
 for x in ex.map(one,files.items()):print(x,flush=True)
