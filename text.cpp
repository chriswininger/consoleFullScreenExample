#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <string>
#include <getopt.h>             /* getopt_long() */

#include <fcntl.h>              /* low-level i/o */
#include <unistd.h>
#include <errno.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/time.h>
#include <sys/ioctl.h>

#include <linux/videodev2.h>



int main() {
	int test;
	std::string fd = "/dev/video0";
	struct v4l2_input input;
	//int index;

	if (-1 == ioctl (fd, VIDIOC_G_INPUT, &test)) {
		perror ("VIDIOC_G_INPUT");
		exit (EXIT_FAILURE);
	}

	memset (&input, 0, sizeof (input));
	input.index = test;

	if (-1 == ioctl (fd, VIDIOC_ENUMINPUT, &input)) {
		perror ("VIDIOC_ENUMINPUT");
		exit (EXIT_FAILURE);
	}

	printf ("Current input: %s\n", input.name);
	return 0;
}

