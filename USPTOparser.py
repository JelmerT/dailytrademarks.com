#!/usr/bin/env python

# Copyright (c) 2014, Jelmer Tiete <jelmer@tiete.be>.
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

zf_name = 'hr150313.zip'

zf = zipfile.ZipFile(zf_name, 'r')
# print zf.namelist()

print ('Extracting archive')

# for name in zf.namelist():
#   (dirname, filename) = os.path.split(name)
#   print "Decompressing " + filename + " on " + dirname
#   if not os.path.exists(os.path.join(os.path.basename(os.path.splitext(zf_name)[0]), dirname)):
#     os.makedirs(os.path.join(os.path.basename(os.path.splitext(zf_name)[0]), dirname))
#   zf.extract(name, os.path.join(os.path.basename(os.path.splitext(zf_name)[0]), '.'))

print ('Looking for XML files')

filetypes = ("*.xml","*.XML")
xml_filelist = []

for root, dirnames, filenames in os.walk(os.path.basename(os.path.splitext(zf_name)[0])):
 for ft in filetypes:
  for f in fnmatch.filter(filenames, ft):
   xml_filelist.append(os.path.join(root, f))
# print xml_filelist

print ('Reading XML files and copying images')

os.makedirs('./images')

for xml_file in xml_filelist:
	tree = ET.parse(xml_file)
	root = tree.getroot()
	# print xml_file
	for serial_number in root.iterfind('.//serial-number'):
		# print 'serial:', serial_number.text
		prev_image_name = []
		for image_tag in root.iterfind('.//file-name'):
			if image_tag.text == '00000002.JPG':
				prev_image_name = image_tag.text
				image_path = os.path.join(os.path.dirname(xml_file), image_tag.text)
				new_image_path = os.path.join('./images', serial_number.text+'-'+image_tag.text)
				shutil.copy(image_path, new_image_path)
			else:
				# print 'duplicate'
				break

print ('Deleting extracted archive')

# shutil.rmtree(os.path.join('.',os.path.basename(os.path.splitext(zf_name)[0])))

# for filename in [ '865599/86559956/00000001.XML', 'notthere.txt' ]:
#     try:
#         data = zf.read(filename)
#     except KeyError:
#         print 'ERROR: Did not find %s in zip file' % filename
#     else:
#         print filename, ':'
#         print repr(data)
#     print

# tree = ET.parse('country_data.xml')
# root = tree.getroot()