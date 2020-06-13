#### 2.1.54

- Move to transform runtime to remove regenerator issues

#### 2.1.53

- Ensure requestAnimationFrame starts on next frame

#### 2.1.52

- Buffer animation callbacks to reduce calls to requestAnimationFrame

#### 2.1.51

- Fix a bug in starting update coroutines with parameters

#### 2.1.50

- Handle the case where the Promise yielded is immediately resolved without
  going through the restart process

#### 2.1.49

- Added the ability to yield a Promise and have the coroutine
  restart when it finishes
  
- Deprecated runAsync (due to above)

#### 2.1.44 - 2.1.48

- Adjust polyfill for a variety of Safari use cases

#### 2.1.43

- Fix polyfill on Safari

#### 2.1.42

- Can start `run` or `update` with the results of calling a generator to enable parameter passing
- Main website linked

#### 2.1.41

- Improved polyfill

#### 2.1.40

- Tested react native

#### 2.1.38

- Provide own polyfill for requestIdleCallback

#### 2.1.37

- remove direct reference to requestIdleCallback polyfill for React Native support.  This 
  can now be added manually on websites requiring it
- first attempts at RN support

#### 1.1.36

- fix documentation typo

#### 1.1.35

- fixed build issue

#### 1.1.34

- Update documentation
- Fix an issue with encodeURIComponent version of lz-string

#### 1.1.33

- Add compress and decompression from lz-string in the gaps

#### 1.1.32

- setTimeout idle time background processing
- can yield a number to request that number of m/s in the current frame (request does not carry over to the next frame)
- added async examples to getting started

#### 1.1.31

- Too early for last update, reverting

#### 1.1.30

- Use setTimeout for run timeouts to ensure we get some background processing

#### 1.1.29

- Fix a bug where terminate on the run promise was lost due to double async wrapping

#### 1.1.28

- Massively improve performance by replacing Yastjson's stack based bracket analyser with a couple of ints

#### 1.1.27

- Improve performance by reducing yields during the tokenise phase to 1 in every 2048 characters

#### 1.1.26

- Rewrite JSON tokenizer and AST for performance (again!)

#### 1.1.25

- Fix a problem with escaped JSON strings not being fully handled by yastjson
- Reintroduce .toJSON() in stringify

#### 1.1.24

- Made sure Async functions return a terminatable promise
- Fixed the CHANGELOG formatting!

#### 1.1.23

- Fix a bug with resolver now just being the actual promise resolve.

#### 1.1.22

- Link article on how it works

#### 1.1.21

- Documentation improvements

#### 1.1.20

- Updated the demo in the README.md to be the async one

#### 1.1.19

- Fixed build issue

#### 1.1.18

- Added Async function wrappers
- Refactored project structure
- Improved demo to show async

#### 1.1.15

- Licence updates
- Documentation typos

#### 1.1.14

- Added JSON functions for serialize/parse
- Updated test app
- Updated documentation
- Added CHANGELOG
