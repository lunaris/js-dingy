SRC				= src
BUILD 		= build
TEST			= test

ES6C			= ./node_modules/traceur/traceur
ES6CFLAGS	= --experimental

RM				= rm -rf

.PHONY: build clean test

build: $(wildcard $(SRC)/*.js)
	$(ES6C) $(ES6CFLAGS) --dir $(SRC) $(BUILD)

clean:
	$(RM) $(BUILD)
