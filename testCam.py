import pygame
import pygame.camera
import sys
import os
from pygame.locals import *

pygame.init()
pygame.camera.init()
cam = pygame.camera.Camera("/dev/video0",(640,480))
cam.start()
imageStr = cam.get_raw()

with open('file_test2.jpg', 'wb') as jpgFile:
    jpgFile.write(imageStr)

sys.stdout.write(imageStr)


#os.write(1, imageStr)
#sys.stdout.buffer.write(imageStr)
#print(imageStr)