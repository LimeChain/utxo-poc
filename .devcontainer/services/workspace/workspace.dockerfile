FROM node:21.2.0-bullseye

# configure users
ARG MNT_PATH
ARG PASS
ARG USER_ID
ARG USER_NAME
ARG GROUP_ID
ARG GROUP_NAME

RUN if [ $USER_NAME != 'root' ]; then \
    groupmod -g 2000 node; \
    usermod -u 2000 -g 2000 node; \
    addgroup -gid $GROUP_ID $GROUP_NAME; \
    adduser --disabled-password -gecos "" -uid $USER_ID -gid $GROUP_ID $USER_NAME; \
    fi && \
    usermod -a -G sudo $USER_NAME && \
    echo "$USER_NAME:$PASS" | chpasswd && \
    echo "root:$PASS" | chpasswd

# install sudo
RUN apt-get update && apt-get -y install sudo git libc++-dev

# install nargo
RUN cd /tmp && \
    curl -o ./nargo-x86_64-unknown-linux-gnu.tar.gz -L https://github.com/noir-lang/noir/releases/download/v0.19.3/nargo-x86_64-unknown-linux-gnu.tar.gz && \
    tar -xvf ./nargo-x86_64-unknown-linux-gnu.tar.gz -C /usr/bin/


WORKDIR $MNT_PATH

USER $USER_NAME

RUN curl -L https://foundry.paradigm.xyz | bash && \
    ~/.foundry/bin/foundryup

CMD ["sleep", "infinity"]
