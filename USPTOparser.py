#!/usr/bin/env python

# Copyright (c) 2015, Jelmer Tiete <jelmer@tiete.be>.
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
# 1. Redistributions of source code must retain the above copyright
#    notice, this list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright
#    notice, this list of conditions and the following disclaimer in the
#    documentation and/or other materials provided with the distribution.
# 3. The name of the author may not be used to endorse or promote
#    products derived from this software without specific prior
#    written permission.

# THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS
# OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
# DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
# GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
# INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
# WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
# NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import os, zipfile, fnmatch
import xml.etree.ElementTree as ET
import shutil
import requests
import datetime as dt
import pymongo

def download_file(url):
    local_filename = url.split('/')[-1]
    # NOTE the stream=True parameter
    r = requests.get(url, stream=True)
    with open(local_filename, 'wb') as f:
        for chunk in r.iter_content(chunk_size=1024): 
            if chunk: # filter out keep-alive new chunks
                f.write(chunk)
                f.flush()
    return local_filename

# try removing leftovers from prev attempts
try:
	shutil.rmtree('./images_new')
	##os.remove("./hr*")
except Exception:
	pass


print ('Downloading archive:')

yest_date = dt.datetime.utcnow() - dt.timedelta( days = 2 )
url_filename = 'hr'+yest_date.strftime("%y%m%d")+'.zip'
print(url_filename)
url = 'http://storage.googleapis.com/trademarks/application_images/2015/'+url_filename

zf_name = download_file(url)

zf = zipfile.ZipFile(zf_name, 'r')
# print zf.namelist()

print ('Extracting archive')

for name in zf.namelist():
  (dirname, filename) = os.path.split(name)
  # print "Decompressing " + filename + " on " + dirname
  if not os.path.exists(os.path.join(os.path.basename(os.path.splitext(zf_name)[0]), dirname)):
    os.makedirs(os.path.join(os.path.basename(os.path.splitext(zf_name)[0]), dirname))
  zf.extract(name, os.path.join(os.path.basename(os.path.splitext(zf_name)[0]), '.'))

print ('Deleting archive')
# remove the archive
os.remove(zf_name)

print ('Looking for XML files')

filetypes = ("*.xml","*.XML")
xml_filelist = []

for root, dirnames, filenames in os.walk(os.path.basename(os.path.splitext(zf_name)[0])): #change to zf_name
 for ft in filetypes:
  for f in fnmatch.filter(filenames, ft):
   xml_filelist.append(os.path.join(root, f))
# print xml_filelist

print ('Connecting to DB')

# Connection to Mongo DB
try:
    client = pymongo.MongoClient("localhost", 27017)
    #remove previous db
    client.drop_database('trademarkDB')
    db = client.trademarkDB
    tm = db.trademark
    print "Connected successfully"
except pymongo.errors.ConnectionFailure, e:
   print "Could not connect to MongoDB: %s" % e 

print ('Parsing XML files and copying images')

os.makedirs('./images_new')

for xml_file in xml_filelist:
	tree = ET.parse(xml_file)
	root = tree.getroot()
	# print xml_file
	for serial_number in root.iterfind('.//serial-number'):
		# print 'serial:', serial_number.text
		data = {}
		image = []
		#add serial num to DB entry
		data['serial'] = int(serial_number.text)
		#add name to DB entry
		try:
			data['name'] = next(name for name in root.iterfind('.//mark-text')).text
		except Exception:
  			pass #no name found
  		#add fee amount to DB entry
		try:
			data['fee'] = int(next(fee for fee in root.iterfind('.//fee-types/total-amount')).text)
		except Exception:
  			pass #no fee found
		#add the images to DB entry
		prev_image_name = []
		for image_tag in root.iterfind('.//file-name'):
			if image_tag.text != prev_image_name:	#check for duplicate
				prev_image_name = image_tag.text
				image_path = os.path.join(os.path.dirname(xml_file), image_tag.text)
				new_image_path = os.path.join('./images_new', serial_number.text+'-'+image_tag.text)
				shutil.copy(image_path, new_image_path) #copy image to temp local images folder
				image.append(image_tag.text)
			else:
				# print 'duplicate'
				break
		data['image'] = image #add list of images to entry
		data['num_images'] = len(image)	#add amount of images to entry
		# print data
		tm_id = tm.insert_one(data).inserted_id
# adding meta-data to DB
data = {}
data['db_date'] = yest_date.strftime("%y%m%d")
data["db_num_records"] = tm.count()
data["db_total_fee"] = 0 #TODO
data["db_total_images"] = 0 #TODO
tm.insert_one(data)

print ('Deleting extracted archive')
shutil.rmtree(os.path.join('.',os.path.basename(os.path.splitext(zf_name)[0])))

print ('Replacing image folder with new one')
try:
	shutil.rmtree('./images')
except Exception:
	pass
os.rename('./images_new','./images')
