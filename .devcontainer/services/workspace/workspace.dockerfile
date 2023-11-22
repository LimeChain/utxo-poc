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

#install sudo
RUN apt-get update && apt-get -y install sudo git

WORKDIR $MNT_PATH

USER $USER_NAME

CMD ["sleep", "infinity"]
